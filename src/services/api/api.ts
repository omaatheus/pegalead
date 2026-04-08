"use server";

import { LeadFormData, ApiResponse } from "@/types";
import { loginSuperAdmin } from "./loginSuperAdmin";
import { createCompany } from "./createCompany";
import { CompanyData } from "@/types";
import { env } from "@/config/env";
import { addAnalytics } from "./addAnalytics";
import { log } from "console";
import { addToHopper } from "./addToHopper";

export const GenerateTestAccess = async (data: CompanyData & LeadFormData): Promise<ApiResponse> => {
  try {
    const loginResponse = await loginSuperAdmin();

    if (!loginResponse) {
      throw new Error('Falha ao obter credenciais do super admin');
    }

    const password = Math.random().toString(36).slice(-8);

    const companyData: CompanyData = {
      admin_name: data.name,
      phone:  "+55 " + data.phone,
      company_name: data.company,
      company_phone: data.company_phone,
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

    //let resCreateCompany = await createCompany(companyData, loginResponse.token);

    //data.company_id = resCreateCompany.data.company_id;

    //await addAnalytics(data, loginResponse.token);

    await addToHopper(data);

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