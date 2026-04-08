export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  identifier: string;
  selectedAnalytics: string[];
}

export type ApiResponse = 
  | {
      sucess: true;
      credentials: {
        user: string;
        password: string;
        acessLink: string;
      };
    }
  | {
      sucess: false;
      isApiValidationError: true;
      fields: Record<string, string[]>; 
    }
  | {
      sucess: false;
      isApiValidationError?: false;
      message: string;
    };


export interface CompanyData {
  admin_name: string;
  company_name: string;
  company_phone: string;
  email: string;
  global_plan_id: number;
  identifier: string;
  password: string;
  password_confirmation: string;
  personType: "legal" | "string";
  phone: string;
  status: "activated" | string; 
  timezone: string;
  expired_at: Number | null;

  address?: string;
  cep?: string;
  city?: string;
  complement?: string;
  district?: string;
  number?: string;
}