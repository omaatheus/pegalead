"use server";

import { env } from "@/config/env";
import { LeadFormData } from "@/types";
import axios from "axios";
import { analyticsFormatter, companySegmentFormatter } from "@/utils/utils";

export async function addToHopper(data: LeadFormData) {
    
    let apiUrl: string;
    let apiToken: string;
    let columnid: string;

    if (data.origin === "abrint_2026") {
        apiUrl = env.commandUrlAbrint;
        apiToken = env.commandTokenAbrint;
        columnid = env.columnIdAbrint;
    } else {
        apiUrl = env.commandUrl;
        apiToken = env.commandToken;
        columnid = env.columnId;
    }

    const selectedAnalytics: string[] = analyticsFormatter(data.selectedAnalytics);

    if (data.origin === "abrint_2026" && data.wants_zeus_vision) {
        selectedAnalytics.push("Zeus Vision");
    }

    const company_segment = companySegmentFormatter(data.company_segment);

    const formData = {
        "columnId": columnid,
        "title": `${data.name} - ${data.company}`,
        "description": `${data.name} - ${data.company} esse lead foi capturado pelo Formulário da Abrint.`,
        "fields": {
            "email": `${data.email}`,
            "phone": `${data.phone}`,
            "document": `${data.identifier}`,
            "empresa": `${data.company}`,
            "interesse": selectedAnalytics.join(", "), // O join cuida perfeitamente da mesclagem
            "tipo_lead": company_segment,
            "origem": data.origin || "Formulário de Leads - Zions"
        }
    }   

    try {

        const resp = await axios.post(
            apiUrl,
            formData,
            {
                headers: {
                    "x-kanban-token": `${apiToken}`,
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