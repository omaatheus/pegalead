export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  identifier: string;
  selectedAnalytics: string[];
  company_segment: string;
  origin?: string; 
  wants_heimdall?: boolean;
  wants_zeus_vision?: boolean;
}

export type ApiResponse = 
  | {
    sucess: true;
    message: string;
  }
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
  company_id?: number;
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

type HeimdallAnalyticPermission = {
  name: string;
  active: boolean;
};

export type HeimdallFeaturesPermission = HeimdallAnalyticPermission;

type HeimdallAnalyticPlan = {
  analytic: {
    lpr: HeimdallAnalyticPermission;
    panic: HeimdallAnalyticPermission;
    radar: HeimdallAnalyticPermission;
    evasion: HeimdallAnalyticPermission;
    intrusion: HeimdallAnalyticPermission;
    inactivity: HeimdallAnalyticPermission;
    permanence: HeimdallAnalyticPermission;
    agglomeration: HeimdallAnalyticPermission;
    vehicle_evasion: HeimdallAnalyticPermission;
    animal_intrusion: HeimdallAnalyticPermission;
    vehicle_intrusion: HeimdallAnalyticPermission;
    vehicle_agglomeration: HeimdallAnalyticPermission;
    epi_intrusion: HeimdallAnalyticPermission;
    epi_evasion: HeimdallAnalyticPermission;
    scene_change: HeimdallAnalyticPermission;
    time_lapse: HeimdallAnalyticPermission;
    facial_recognition: HeimdallAnalyticPermission;
    inactive_camera: HeimdallAnalyticPermission;
  };
  features?: {
    cameraSharing: HeimdallFeaturesPermission;
    vmsIntegration: HeimdallFeaturesPermission;
    moniIntegration: HeimdallFeaturesPermission;
    gearIntegration: HeimdallFeaturesPermission;
  };
};

export interface HeimdallPlan {
  id: number;
  name: string;
  company: { name: string; id: number };
  max_number_logins: number;
  permissions: HeimdallAnalyticPlan;
  platform_routes: HeimdallPlatformRoutes;
}

export type HeimdallDynamicRoute = {
  path: string;
  index: boolean;
  enabled: boolean;
  children?: HeimdallDynamicRoute[];
};

type HeimdallRoutes = {
  authRoutes: HeimdallDynamicRoute[];
  mainRoutes: HeimdallDynamicRoute[];
  monitoringRotues: HeimdallDynamicRoute[];
};

export type HeimdallPlatformRoutes = {
  web: HeimdallRoutes;
  mobile: HeimdallRoutes;
};

