export const env = {
    heimdallSubdomain: process.env.NEXT_PUBLIC_HEIMDALL_SUBDOMAIN || "",
    superadminUser: process.env.NEXT_PUBLIC_SUPERADMIN_USER || "",
    superadminPassword: process.env.NEXT_PUBLIC_SUPERADMIN_PASSWORD || "",
    commandToken: process.env.NEXT_PUBLIC_COMMAND_TOKEN || "",
    commandUrl: process.env.NEXT_PUBLIC_COMMAND_URL || ""
};