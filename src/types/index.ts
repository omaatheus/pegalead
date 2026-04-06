export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  cnpj: string;
  selectedAnalytics: string[];
}

export interface ApiResponse {
  sucess: boolean;
  credentials?: {
    user: string;
    password: string;
    acessLink: string;
  };
  error?: string;
}