import { LeadFormData } from "@/types";
import { prisma } from "../lib/prisma";

export async function saveLeadsToStorage(data: LeadFormData) {
    try {
        const existCnpj = await prisma.lead.findUnique({
            where: {
                identifier: data.identifier
            }
        });

        if (existCnpj) {
            console.log("Lead já existe no banco de dados:", existCnpj);
            throw new Error("CNPJ já resgatou seu teste gratuito.");
        }

        const res = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                identifier: data.identifier,
                company: data.company,
                segment: data.company_segment,
                selectedAnalytics: data.selectedAnalytics
            }
        });

        return { success: true, lead: res };

    } catch (error) {
        console.error("Erro ao salvar o lead no banco de dados:", error);
        
        if (error instanceof Error && error.message === "CNPJ já resgatou seu teste gratuito.") {
            throw error; 
        }
        throw new Error("Não foi possível salvar o lead. Tente novamente mais tarde.");
    }
}