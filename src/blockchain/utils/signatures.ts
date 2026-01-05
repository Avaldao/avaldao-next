import { Aval } from "@/types";

  function getRVS(signature: string) {
    const r = "0x" + signature.substring(2).substring(0, 64);
    const v = "0x" + signature.substring(2).substring(64, 128);
    const s = parseInt(signature.substring(2).substring(128, 130), 16);
    return [r, v, s];
  }


  export function getSignatures(aval: Aval) {
    if (!aval.avaladoSignature ||
      !aval.solicitanteSignature ||
      !aval.comercianteSignature ||
      !aval.avaladoSignature
    ) return;

    const [avaldaoSignatureR, avaldaoSignatureS, avaldaoSignatureV] = getRVS(aval.avaldaoSignature!)
    const [solicitanteSignatureR, solicitanteSignatureS, solicitanteSignatureV] = getRVS(aval.solicitanteSignature!)
    const [comercianteSignatureR, comercianteSignatureS, comercianteSignatureV] = getRVS(aval.comercianteSignature!)
    const [avaladoSignatureR, avaladoSignatureS, avaladoSignatureV] = getRVS(aval.avaladoSignature!)


    const signatureV = [avaldaoSignatureV, solicitanteSignatureV, comercianteSignatureV, avaladoSignatureV];
    const signatureR = [avaldaoSignatureR, solicitanteSignatureR, comercianteSignatureR, avaladoSignatureR];
    const signatureS = [avaldaoSignatureS, solicitanteSignatureS, comercianteSignatureS, avaladoSignatureS];

    return [
      signatureV,
      signatureR,
      signatureS,
    ]
  }