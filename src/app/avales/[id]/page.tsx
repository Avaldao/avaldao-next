import Page from "@/components/layout/page";
import AvalesService from "@/services/avales-service";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Users, Target, FileText, UserCheck, Store, Shield } from "lucide-react";
import { shortenAddress } from "@/utils";

interface AvalDetailsPageProps {
  params: Promise<{ id: string }>;
}

// Función para formatear fechas
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para obtener el texto del status
const getStatusText = (status: number) => {
  const statusMap: { [key: number]: { text: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
    0: { text: "Pendiente", variant: "outline" },
    1: { text: "En Proceso", variant: "secondary" },
    2: { text: "Aprobado", variant: "default" },
    3: { text: "Completado", variant: "default" },
    4: { text: "Rechazado", variant: "destructive" },
  };
  return statusMap[status] || { text: "Desconocido", variant: "outline" };
};


export default async function AvalDetailsPage({ params }: AvalDetailsPageProps) {
  const { id } = await params;

  try {
    const aval = await new AvalesService().getAval(id);

    if (!aval) {
      return (
        <Page>
          <div className="container mx-auto p-6">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Aval No Encontrado</h2>
                <p className="text-slate-600 mb-6">
                  El aval con ID {id} no existe o no pudo ser cargado.
                </p>
                <Badge variant="destructive">ID Inválido</Badge>
              </CardContent>
            </Card>
          </div>
        </Page>
      );
    }

    const statusInfo = getStatusText(aval.status);

    return (
      <Page>
        <div className="container mx-auto p-6 space-y-6">
          {/* Header con información básica */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    {aval.proyecto}
                  </CardTitle>
                  <p className="text-slate-600 mt-2">ID: {aval._id}</p>
                </div>
                <Badge variant={statusInfo.variant}>
                  {statusInfo.text}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Información principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Objetivo del proyecto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Objetivo del Proyecto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 whitespace-pre-line">{aval.objetivo}</p>
                </CardContent>
              </Card>

              {/* Adquisición */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Adquisición Planeada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{aval.adquisicion}</p>
                </CardContent>
              </Card>

              {/* Beneficiarios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    Beneficiarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{aval.beneficiarios}</p>
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha - Información técnica y financiera */}
            <div className="space-y-6">
              {/* Información financiera */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Financiera</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Monto FIAT:</span>
                    <span className="font-bold text-green-600">
                      ${aval.montoFiat.toLocaleString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Cantidad de Cuotas:</span>
                    <span className="font-semibold">{aval.cuotasCantidad}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Duración Cuota:</span>
                    <span className="font-semibold">
                      {Math.round(aval.duracionCuotaSeconds / 86400)} días
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Tiempo Desbloqueo:</span>
                    <span className="font-semibold">
                      {Math.round(aval.desbloqueoSeconds / 86400)} días
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Fechas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Fechas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Fecha de Inicio:</p>
                    <p className="font-semibold">{formatDate(aval.fechaInicio)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Creado:</p>
                    <p className="font-semibold">{formatDate(aval.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Actualizado:</p>
                    <p className="font-semibold">{formatDate(aval.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Direcciones de Wallets */}
              <Card>
                <CardHeader>
                  <CardTitle>Participantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Solicitante:
                    </p>
                    <p className="font-mono text-sm" title={aval.solicitanteAddress}>
                      {shortenAddress(aval.solicitanteAddress)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Comerciante:
                    </p>
                    <p className="font-mono text-sm" title={aval.comercianteAddress}>
                      {shortenAddress(aval.comercianteAddress)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Avalado:
                    </p>
                    <p className="font-mono text-sm" title={aval.avaladoAddress}>
                      {shortenAddress(aval.avaladoAddress)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      AvalDAO:
                    </p>
                    <p className="font-mono text-sm" title={aval.avaldaoAddress}>
                      {shortenAddress(aval.avaldaoAddress)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Firmas (si existen) */}
              {(aval.solicitanteSignature || aval.avaladoSignature || aval.comercianteSignature || aval.avaldaoSignature) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Firmas Digitales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aval.solicitanteSignature && (
                      <div>
                        <p className="text-sm text-slate-600">Firma Solicitante:</p>
                        <p className="font-mono text-xs truncate" title={aval.solicitanteSignature}>
                          {shortenAddress(aval.solicitanteSignature)}
                        </p>
                      </div>
                    )}
                    {aval.avaladoSignature && (
                      <div>
                        <p className="text-sm text-slate-600">Firma Avalado:</p>
                        <p className="font-mono text-xs truncate" title={aval.avaladoSignature}>
                          {shortenAddress(aval.avaladoSignature)}
                        </p>
                      </div>
                    )}
                    {aval.comercianteSignature && (
                      <div>
                        <p className="text-sm text-slate-600">Firma Comerciante:</p>
                        <p className="font-mono text-xs truncate" title={aval.comercianteSignature}>
                          {shortenAddress(aval.comercianteSignature)}
                        </p>
                      </div>
                    )}
                    {aval.avaldaoSignature && (
                      <div>
                        <p className="text-sm text-slate-600">Firma AvalDAO:</p>
                        <p className="font-mono text-xs truncate" title={aval.avaldaoSignature}>
                          {shortenAddress(aval.avaldaoSignature)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Page>
    );
  } catch (error) {
    return (
      <Page>
        <div className="container mx-auto p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Error al Cargar Aval</h2>
              <p className="text-slate-600 mb-4">
                Ocurrió un error al intentar cargar la información del aval.
              </p>
              <Badge variant="destructive">Error del Sistema</Badge>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }
}