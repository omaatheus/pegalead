import { env } from "@/config/env";
import { LeadFormData } from "@/types";
import axios from "axios";
import { ANALYTICS_OPTIONS } from "@/constants/analytics";

export async function addToHopper(data: LeadFormData) {

    const apiUrl = env.commandUrl;

    const selectedAnalytics: string[] = data.selectedAnalytics;

    selectedAnalytics.forEach((analytic, i) => {
        if( ANALYTICS_OPTIONS.find(opt => opt.id === analytic)){
            selectedAnalytics[i] = ANALYTICS_OPTIONS.find(opt => opt.id === analytic)?.label || analytic;
        }
    });

    const formData = {
        "columnId": "1dab67a6-a9c0-4bc9-b462-130ff7cff93c",
        "title": `${data.name} - ${data.company} - HEIMDALL AI`,
        "description": `${data.name} - ${data.company} esse lead foi capturado pelo Formulário de Teste.`,
        "fields": {
            "email": `${data.email}`,
            "phone": `${data.phone}`,
            "document": `${data.identifier}`,
            "empresa": `${data.company}`,
            "interesse": selectedAnalytics.join(", "),
            "tipo_lead": "Central de Monitoramento",
            "origem": "Formulário de Leads - Zions"
        }
    }   

    try {

        const resp = await axios.post(
            apiUrl,
            formData,
            {
                headers: {
                    "x-kanban-token": `${env.commandToken}`,
                    "Content-Type": "application/json"
                }
            }
        )

        return resp.data;

    } catch (error: any) {
    console.error('Erro ao enviar dados para o funil: ', error);
    
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
}