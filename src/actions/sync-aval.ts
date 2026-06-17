"use server";

import AvalesService from "@/services/avales-service";


export default async function syncAval(avalId: string) {
  const avalesService = new AvalesService();
  try {
    await avalesService.syncAvalOnChain(avalId);
    return { success: true, message: "Aval synced with chain successfully" };
  } catch (error) {
    console.error("Error syncing aval:", error);
    throw error;
  }  

}