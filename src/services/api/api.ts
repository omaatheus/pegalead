"use server";

import { LeadFormData, ApiResponse } from "@/types";
import { loginSuperAdmin } from "./loginSuperAdmin";
import { createCompany } from "./createCompany";
import { CompanyData } from "@/types";
import { env } from "@/config/env";

export const GenerateTestAccess = async (data: LeadFormData): Promise<ApiResponse> => {
  try {
    const loginResponse = await loginSuperAdmin();

    if (!loginResponse) {
      throw new Error('Falha ao obter credenciais do super admin');
    }

    const password = Math.random().toString(36).slice(-8);

    const companyData: CompanyData = {
      admin_name: data.name,
      phone:  data.phone,
      company_name: data.company,
      company_phone: data.phone,
      email: data.email,
      global_plan_id: 1,
      identifier: data.identifier,
      password: password,
      password_confirmation: password,
      personType: "legal",
      status: "activated",
      timezone: "America/Sao_Paulo",
      expired_at: 7
    };

    await createCompany(companyData, loginResponse.token);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          sucess: true, 
          credentials: {
            user: data.email,
            password: password,
            acessLink: `https://${env.heimdallSubdomain}.heimdallcloud.com.br`
          }
        });
      }, 2500);
    });

  } catch (error: any) {
    console.error('Erro ao enviar dados: ', error);
    
    if (error.isApiValidationError) {
      return {
        sucess: false,
        isApiValidationError: true,
        fields: error.fields
      };
    }

    return {
      sucess: false,
      message: error.message || "Ocorreu um erro interno no servidor."
    };
  }
};