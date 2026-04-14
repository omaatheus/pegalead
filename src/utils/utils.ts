import { ANALYTICS_OPTIONS } from "@/constants/analytics";
import { COMPANY_OPTIONS } from "@/constants/typeCompany";

export function companySegmentFormatter(companySegmentId: string) {
    return COMPANY_OPTIONS.find(company => company.id === companySegmentId)?.label || companySegmentId;
}

export function analyticsFormatter(selectedAnalytics: string[]): string[] {
    return selectedAnalytics.map(analytic => {
        const foundOption = ANALYTICS_OPTIONS.find(opt => opt.id === analytic);
        return foundOption ? foundOption.label : analytic;
    });
}