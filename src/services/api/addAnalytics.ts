"use server";

import axios from "axios";
import { env } from "@/config/env";

export async function addAnalytics() {

    const apiUrl = `https://${env.heimdallSubdomain}.heimdallcloud.com.br/api/store_company_user`;
    const appUrl = `${env.heimdallSubdomain}.heimdallcloud.com.br`;

    try {
        
        
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.errors) {
            throw { 
                isApiValidationError: true, 
                fields: error.response.data.errors 
            };
        }
        
        throw new Error("Ocorreu um erro inesperado ao conectar com o servidor.");
    }

}