import { LeadFormData, ApiResponse } from "@/types";

export const GenerateTestAccess = async (dados: LeadFormData): Promise<ApiResponse> => {
  console.log('Enviando dados para o funil de leads:', dados);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sucess: true,
        credentials: {
          user: `demo_${dados.company.replace(/\s+/g, '').toLowerCase()}`,
          password: Math.random().toString(36).slice(-8),
          acessLink: 'https://neuralseg.heimdallcloud.com.br'
        }
      });
    }, 2500);
  });
};