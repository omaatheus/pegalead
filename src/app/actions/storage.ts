'use server';

import { LeadFormData } from "@/types";
import { prisma } from "../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { analyticsFormatter, companySegmentFormatter } from "@/utils/utils";

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

        const selectedAnalytics = analyticsFormatter(data.selectedAnalytics);
        const company_segment = companySegmentFormatter(data.company_segment);

        const res = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                identifier: data.identifier,
                company: company_segment,
                segment: data.company_segment,
                selectedAnalytics: selectedAnalytics
            }
        });

        return { success: true, lead: res };

    } catch (error) {
        console.error("Erro ao salvar o lead no banco de dados:", error);
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error("Este e-mail já está cadastrado no nosso sistema." );
            }
        }

        if (error instanceof Error && error.message === "CNPJ já resgatou seu teste gratuito.") {
            throw new Error("Esse CNPJ já resgatou seu teste gratuito.");
        }   
        throw new Error("Não foi possível salvar o lead. Tente novamente mais tarde.");
    }
}