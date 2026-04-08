"use server";

import axios from "axios";
import { env } from "@/config/env";
import { CompanyData, LeadFormData } from "@/types";
import { DEFAULT_HEIMDALL_PLAN } from "@/constants/defaultHeimdallPlan";

export async function addAnalytics(data: CompanyData & LeadFormData, token: string) {
    const apiUrl = `https://${env.heimdallSubdomain}.heimdallcloud.com.br/api/plan/${data.company_id}?_method=PUT`;

    try {

    const planToUpdate = JSON.parse(JSON.stringify(DEFAULT_HEIMDALL_PLAN));

    const analyticsObj = planToUpdate.permissions.analytic;

    Object.keys(analyticsObj).forEach((key) => {
        analyticsObj[key].active = data.selectedAnalytics.includes(key);
    });

    const isTimelapseActive = data.selectedAnalytics.includes("time_lapse");

    const webTimelapseRoute = planToUpdate.platform_routes.web.mainRoutes.find(
        (route: any) => route.path === "timelapse"
    );
    if(webTimelapseRoute){
        webTimelapseRoute.enabled = isTimelapseActive;
    }

    const formData = new FormData();

    formData.append("name", `Plano Padrão ${data.company}`);
    formData.append("company_id", `${data.company_id}`);
    formData.append("max_number_logins", "5");
    formData.append("permissions", JSON.stringify(planToUpdate.permissions));
    formData.append("platform_routes", JSON.stringify(planToUpdate.platform_routes));

    const res = await axios.post(apiUrl, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',

            'Content-Type': 'multipart/form-data',
        },
    })

    return res.data;
        
    } catch (error) {
        console.error("=== ERRO NA REQUISIÇÃO AXIOS ===");
        
        if (axios.isAxiosError(error)) {
            console.error("Status HTTP:", error.response?.status);
            console.error("Resposta da API (Data):", JSON.stringify(error.response?.data, null, 2));
            console.error("URL acessada:", error.config?.url);
            console.error("Mensagem do Axios:", error.message);
        } else {
            console.error("Erro desconhecido:", error);
        }
        if (axios.isAxiosError(error) && error.response?.data?.errors) {
            throw { 
                isApiValidationError: true, 
                fields: error.response.data.errors 
            };
        }
        
        throw new Error("Ocorreu um erro inesperado ao conectar com o servidor.");
    }

}