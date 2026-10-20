/**
 * Migración de usuarios legacy (anteriores a la verificación de identidad).
 *
 * Los usuarios creados antes de ese cambio no tienen `status`, `verification`, etc., y por eso no
 * aparecían en el listado de /staff/users. Esta migración completa los campos que faltan y marca
 * como `active` (identidad verificada) a todos los usuarios que no tienen `status`.
 *
 * Solo completa campos AUSENTES ($ifNull): nunca pisa un valor existente, y es idempotente.
 * Los usuarios que ya tienen `status` no se tocan.
 *
 * Uso (dry-run por defecto, no escribe nada):
 *   node --env-file=.env.local scripts/migrate-legacy-users.mjs
 *   node --env-file=.env.local scripts/migrate-legacy-users.mjs --apply
 *
 * Con --apply guarda primero un backup JSON de los documentos afectados en .migration-backups/.
 */
import { MongoClient, ObjectId } from "mongodb";
import fs from "node:fs";
import path from "node:path";

const DB_NAME = "efem-users-production";
const APPLY = process.argv.includes("--apply");

const uri = process.env.MONGO_DB_USERS;
if (!uri) {
  console.error("Falta MONGO_DB_USERS (usar --env-file=.env.local)");
  process.exit(1);
}

const now = new Date();

// Valores por defecto de los campos que faltan. Solo se aplican donde el campo no existe.
const defaults = {
  status: "active",
  accountType: "personal",
  verification: {
    status: "active",
    byUserId: "migration",
    at: now,
    method: "manual",
    note: "Cuenta anterior a la verificación de identidad, migrada como verificada",
  },
  // Estos usuarios entran con la wallet (firma de mensaje).
  authMethods: ["web3"],
  platformRoles: [],
  staffRoles: [],
  staffRolesHistory: [],
  // No aceptaron T&C ni privacidad en el flujo nuevo, ni verificaron un email: no se afirma lo contrario.
  acceptTyC: false,
  acceptPrivacy: false,
  emailVerified: false,
};

// Usuarios legacy que son empresas u organizaciones (el resto queda como `personal`).
// Para estos, `companyName` toma el nombre que ya tenían; el CUIT no se conoce y queda sin completar.
const BUSINESS_IDS = [
  "635711d9d225b30012d1bbbe", // ACDI
  "65f3562fa36c2b0011620b06", // FLORA People&Planet
  "66eb339ce5298a0012425c8f", // Programa Semillas
].map(id => new ObjectId(id));

const client = new MongoClient(uri);
await client.connect();
const users = client.db(DB_NAME).collection("users");

try {
  const filter = { status: { $exists: false } };
  const affected = await users.find(filter).toArray();

  console.log(`Base: ${DB_NAME}`);
  console.log(`Usuarios sin status (a migrar): ${affected.length}`);
  for (const u of affected) {
    const missing = Object.keys(defaults).filter(k => u[k] === undefined || u[k] === null);
    const business = BUSINESS_IDS.some(id => id.equals(u._id));
    console.log(` - ${u._id} ${(u.name ?? "").slice(0, 35).padEnd(35)} ${business ? "BUSINESS" : "personal"} agrega: ${missing.join(", ")}`);
  }

  if (!APPLY) {
    console.log("\nDry-run: no se escribió nada. Ejecutar con --apply para migrar.");
  } else if (affected.length) {
    const dir = path.resolve(".migration-backups");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `users-${now.toISOString().replace(/[:.]/g, "-")}.json`);
    fs.writeFileSync(file, JSON.stringify(affected, null, 2));
    console.log(`\nBackup: ${file}`);

    const set = Object.fromEntries(
      Object.entries(defaults).map(([k, v]) => [k, { $ifNull: [`$${k}`, { $literal: v }] }])
    );
    // Primero las empresas, para que el `$ifNull` general no les deje accountType "personal".
    const businesses = await users.updateMany({ ...filter, _id: { $in: BUSINESS_IDS } }, [
      { $set: { accountType: "business", companyName: { $ifNull: ["$companyName", "$name"] } } },
    ]);
    const result = await users.updateMany(filter, [{ $set: set }]);
    console.log(`Empresas: ${businesses.modifiedCount}`);
    console.log(`Migrados: ${result.modifiedCount} de ${result.matchedCount}`);
  }
} finally {
  await client.close();
}
