"use server";

import { env } from "@/config/env";
import axios from "axios";

export async function loginSuperAdmin() {
    const apiUrl = `https://${env.heimdallSubdomain}.heimdallcloud.com.br/api/login`;

    try {

        const formData = new URLSearchParams();
        formData.append("email", env.superadminUser);
        formData.append("password", env.superadminPassword);

        const response = await axios.post(
            apiUrl,
            formData,
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

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