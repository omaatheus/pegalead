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
        console.error('Erro ao enviar dados para o login do super admin:', error);
        throw error;
    }

}