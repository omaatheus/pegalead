"use server";

import axios from "axios";
import { CompanyData } from "@/types";
import { env } from "@/config/env";

export async function createCompany(companyData: CompanyData, token: string) {

    const apiUrl = `https://${env.heimdallSubdomain}.heimdallcloud.com.br/api/store_company_user`;
    const appUrl = `${env.heimdallSubdomain}.heimdallcloud.com.br`;

    try {
        
        const response = await axios.post(
            apiUrl,
            companyData,
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
        },
                params: {
                    "app_url": appUrl
                }
            }
        )

        return response.data;
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