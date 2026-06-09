import getDb from '@/lib/mongodb';
import { PaginatedResult, UserInfo, UserUpsert } from '@/types';
import { ObjectId } from 'mongodb';
import { getCurrentUser, requireRoles } from '@/lib/auth/authorization';
import OnChainAuthorizationService from './onchain-authorization-service';
import UsersModel, { UserStatus } from '@/lib/db/models/user-model';
import { verifyMessage } from 'ethers';
import { sendMail } from '@/lib/email';

import path from 'path';
import fs from 'fs';
import { translations } from '@/translations';


interface GetAllUsersFilter {
  status?: UserStatus;
  page?: number;
  pageSize?: number;
}

interface UserData {
  message: string;
  signature: string;
  accountType: "personal" | "business";
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  cuit?: string;
  country?: string;
  location?: string;
  platformRoles: string[];
  acceptTyC: boolean;
  acceptPrivacy: boolean;
  language: string;
}

export default class UsersService {

  async signup(request: UserData) {

    const address = verifyMessage(request.message, request.signature); //throws?

    const addressExists = await UsersModel.findOne({ "address": address });
    const emailExists = await UsersModel.findOne({ "email": request.email });

    if (addressExists) {
      throw new Error(`Address already registered: ${address}`);
    } else if (emailExists) {
      throw new Error("Email already registered");
    } else {
      const newUser = new UsersModel({
        address: address,
        accountType: request.accountType,
        email: request.email,
        name: request.accountType === "personal" ? `${request.firstName} ${request.lastName}` : request.companyName,
        firstName: request.firstName,
        lastName: request.lastName,
        companyName: request.companyName,
        cuit: request.cuit,
        country: request.country,
        location: request.location,
        platformRoles: request.platformRoles,
        acceptTyC: request.acceptTyC,
        acceptPrivacy: request.acceptPrivacy,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        language: request.language
      });

      await newUser.save();
    }

    return {};
  }

  async sendActivationEmail(email: string, language: "en" | "es" = "en") {
    //Necesitamos configurar el correo
    const activationToken = Math.random().toString(36).substring(2); // Generate a random token
    const activationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/activate?token=${activationToken}`;

    const t = (key: string) => translations[key]?.[language] ?? key;


    const templatePath = path.join(process.cwd(), 'emails', language, 'activation-email.html');
    const html = fs.readFileSync(templatePath, 'utf-8')
      .replace(/\{\{ACTIVATION_LINK\}\}/g, activationLink);

    await sendMail({
      to: email,
      subject: t("email.activation.subject"),
      text: `${t("email.activation.body")} ${activationLink}`,
      html: html,
    });



  }





  async cacheUserRoles(userId: string, chainId: number, roles: string[]) {

    await UsersModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          [`roles.${chainId}`]: {
            roles: roles,
            lastSyncedAt: new Date(),
          },
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
  }

  async clearUserRolesCache(userId: string, chainId: number) {

    await UsersModel.findByIdAndUpdate(
      userId,
      {
        $unset: {
          [`roles.${chainId}`]: "",
        },
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  async getUserRolesCache(userId: string, chainId: number): Promise<{ roles: string[], lastSyncedAt: Date } | null> {

    const user = await UsersModel.findById(userId);
    if (!user) return null;

    const cache = user.roles?.get(chainId.toString());
    if (!cache) return null;

    return {
      roles: cache.roles,
      lastSyncedAt: cache.lastSyncedAt,
    };
  }


  async getAll(filter: GetAllUsersFilter = {}): Promise<PaginatedResult<UserInfo>> {
    await requireRoles(["ADMIN_ROLE", "AVALDAO_ROLE"]);

    const db = await getDb();
    const query = filter.status ? { status: filter.status } : {};
    const page = filter.page && filter.page > 0 ? Math.floor(filter.page) : 1;
    const pageSize = filter.pageSize && filter.pageSize > 0 ? Math.floor(filter.pageSize) : 10;
    const skip = (page - 1) * pageSize;

    const [totalItems, users] = await Promise.all([
      db.collection<UserInfo>("users").countDocuments(query),
      db.collection<UserInfo>("users")
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
    ]);

    return {
      items: users.map(user => ({
        ...user,
        id: user._id.toString(),
        roles: [] //a estos los voy a buscar onchain.
      })),
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    };
  }


  //TODO: CRITICAL make it available only to admin users
  async getUser(id: string, options?: { resolveInfoCid: boolean }): Promise<UserInfo | null> {

    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "_id": new ObjectId(id) });
    if (user) {
      user.id = user._id.toString();
      console.log(`Fetching roles using chainid? ${process.env.DEFAULT_CHAIN_ID}`);
      const authorizationService = new OnChainAuthorizationService();
      user.roles = await authorizationService.getRoles(user.address);
      user.website = user.url ?? user.website;

      //resolve infocid
      if (!user.avatar && options?.resolveInfoCid && user.infoCid) {
        try {
          const response = await fetch(`https://ipfs.io${user.infoCid}`);
          const data = await response.json();
          if (data.avatarCid) {
            user.avatar = `https://ipfs.io${data.avatarCid}`
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    return user;
  }

  async getUserByAddress(address: string): Promise<UserInfo | null> {
    const requester = await getCurrentUser();
    //Esta funcion se usa en el formulario de aval. Al momento de completar un address hace un lookup por address
    //para mostrar el nombre y el avatar.

    //La linea anterior asegura que solo personas autenticadas pueden hacer ese lookup, 
    // pero no restringe que cualquier usuario pueda hacer lookup de cualquier address. 
    // Esto podria ser un problema de privacidad? En teoria el address es publico, 
    // pero el hecho de que puedas asociarlo a un nombre y avatar hace que sea mas sensible. 
    // Por ahora lo dejo asi, pero es algo para tener en cuenta.

    const db = await getDb();
    const user = await db.collection<UserInfo>("users").findOne({ "address": address });
    if (user) {
      const authorizationService = new OnChainAuthorizationService();
      user.roles = await authorizationService.getRoles(user.address);
      user.id = user._id.toString();
      user.website = user.url ?? user.website;
    }

    return user;
  }



  async updateProfile(data: UserUpsert) {

    let pinataResponse;
    //Procesar data.avatar, ahi podriamos ver desde el front si se modifico o no
    if (data.avatar) {
      //subir el archivo a IPFS, y despues decirle a pinata que lo pinee

      // Convert the uploaded File into a Blob or readable stream
      const fileBuffer = Buffer.from(await data.avatar.arrayBuffer());
      const pinataData = new FormData();
      pinataData.append("file", new Blob([fileBuffer]), data.avatar.name);

      // Use fetch instead of axios
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
        },
        body: pinataData,
      });

      if (response.ok) {
        pinataResponse = await response.json();
      }
    }



    const db = await getDb();

    const update: Record<string, any> = {
      email: data.email,
      name: data.name,
      url: data.website,
      website: data.website
    };

    if (pinataResponse?.IpfsHash) {
      update.avatar = `https://ipfs.io/ipfs/${pinataResponse.IpfsHash}`;
    }




    const user = await db.collection<UserInfo>("users")
      .findOneAndUpdate(
        { _id: new ObjectId(data.id) },
        { $set: update },
        { returnDocument: "after" }
      );

    return {
      avatar: update.avatar,
      ...user
    }

  }
}

