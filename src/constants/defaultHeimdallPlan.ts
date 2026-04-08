import { HeimdallPlan } from "@/types";

    export const DEFAULT_HEIMDALL_PLAN: HeimdallPlan = {
    id: 0,
    company: {
        id: 0,
        name: "defaultHeimdallCompany",
    },
    name: "Plano padrao",
    max_number_logins: 5,
    permissions: {
        analytic: {
        agglomeration: {
            name: "Aglomeração",
            active: false,
        },
        animal_intrusion: {
            name: "Detecção de Animal",
            active: false,
        },
        evasion: {
            name: "Evasão",
            active: false,
        },
        intrusion: {
            name: "Intrusão",
            active: false,
        },
        inactivity: {
            name: "Inatividade",
            active: false,
        },
        permanence: {
            name: "Permanência",
            active: false,
        },
        vehicle_evasion: {
            name: "Ausência de Veículo",
            active: false,
        },
        vehicle_intrusion: {
            name: "Detecção de Veículo",
            active: false,
        },
        vehicle_agglomeration: {
            name: "Congestionamento",
            active: false,
        },
        lpr: {
            name: "Lpr",
            active: false,
        },
        panic: {
            name: "Pânico",
            active: false,
        },
        radar: {
            name: "Radar",
            active: false,
        },
        epi_intrusion: {
            name: "Detecção de EPI",
            active: false,
        },
        epi_evasion: {
            name: "Ausência de EPI",
            active: false,
        },
        scene_change: {
            name: "Mudança de Cena",
            active: false,
        },
        time_lapse: {
            name: "Time Lapse",
            active: false,
        },
        facial_recognition: {
            name: "Reconhecimento Facial",
            active: false
        },
        inactive_camera: {
            name: "Câmera Inativa",
            active: false
        }
        },
        features: {
        cameraSharing: {
            name: "Compartilhamento de câmera",
            active: false,
        },
        vmsIntegration: { name: "Integração VMS", active: true },
        moniIntegration: { name: "Integração MONI", active: true },
        gearIntegration: { name: "Integração GEAR", active: true },
        },
    },
    platform_routes: {
        web: {
        authRoutes: [
            {
            path: "/auth",
            index: true,
            enabled: true,
            },
            {
            path: "lost-password",
            index: false,
            enabled: true,
            },
            {
            path: "reset",
            index: false,
            enabled: true,
            },
            {
            path: "confirm-email",
            index: false,
            enabled: true,
            },
            {
            path: "confirm-update-email",
            index: false,
            enabled: true,
            },
        ],
        mainRoutes: [
            {
            path: "/",
            index: true,
            enabled: true,
            },
            {
            path: "machines",
            index: true,
            enabled: true,
            },
            {
            path: "companies",
            index: false,
            enabled: true,
            children: [
                {
                path: "create-company/:id?",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "plans",
            index: false,
            enabled: true,
            children: [
                { path: "create-plan/:planId?", index: false, enabled: true },
            ],
            },
            {
            path: "operators",
            index: false,
            enabled: true,
            children: [
                {
                path: "create-operator",
                index: false,
                enabled: true,
                },
                {
                path: "edit-operator",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "cameras",
            index: false,
            enabled: true,
            children: [
                {
                path: "add-camera",
                index: false,
                enabled: true,
                },
                {
                path: "map",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "camera-groups",
            index: false,
            enabled: true,
            },
            {
            path: "cameras-aliveness-log",
            index: false,
            enabled: true,
            },
            { path: "actions-log", index: false, enabled: true },
            {
            path: "log/:logType",
            index: false,
            enabled: true,
            },
            {
            path: "facial-recognition",
            index: false,
            enabled: false,
            children: [
                {
                path: "create-facial-rec-person",
                index: false,
                enabled: false,
                },
                {
                path: "create-facial-rec-person-group",
                index: false,
                enabled: false,
                },
                {
                path: "persons/:personId/upload-faces",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "forense",
            index: false,
            enabled: true,
            children: [
                {
                path: "map",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "lpr",
            index: false,
            enabled: true,
            children: [
                {
                path: "blacklist",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "timelapse",
            index: false,
            enabled: false,
            },
            {
            path: "io-devices",
            index: false,
            enabled: true,
            children: [
                {
                path: "create-device",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "devices-log",
            enabled: true,
            index: false,
            },
            {
            path: "panic",
            index: false,
            enabled: true,
            children: [
                {
                path: "create-panic",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "profile",
            index: false,
            enabled: true,
            },
            {
            path: "help",
            index: false,
            enabled: true,
            },
            {
            path: "feedback",
            index: false,
            enabled: true,
            },
            {
            path: "dispatchers",
            index: false,
            enabled: true,
            children: [
                {
                path: "create-dispatcher/:id?",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "vms",
            index: false,
            enabled: true,
            children: [
                {
                path: "create-vms/:id?",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "moni",
            index: false,
            enabled: true,
            children: [
                {
                path: "create-moni/:id?",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "themes",
            index: false,
            enabled: true,
            children: [
                {
                path: "edit-theme/:id",
                index: false,
                enabled: true,
                },
            ],
            },
        ],
        monitoringRotues: [
            {
            path: "monitor",
            index: true,
            enabled: true,
            children: [
                {
                path: "default/:playAudio?/:cameras?/:panicCameras?",
                index: false,
                enabled: true,
                },
                {
                path: "events/:playAudio?/:cameras?/:panicCameras?",
                index: false,
                enabled: true,
                },
            ],
            },
        ],
        },
        mobile: {
        authRoutes: [
            {
            path: "/auth",
            index: true,
            enabled: true,
            },
            {
            path: "lost-password",
            index: false,
            enabled: true,
            },
            {
            path: "reset",
            index: false,
            enabled: true,
            },
            {
            path: "confirm-email",
            index: false,
            enabled: true,
            },
            {
            path: "confirm-update-email",
            index: false,
            enabled: true,
            },
        ],
        mainRoutes: [
            {
            path: "/",
            index: true,
            enabled: false,
            },
            {
            path: "machines",
            index: true,
            enabled: false,
            },
            {
            path: "companies",
            index: false,
            enabled: true,
            children: [
                {
                path: "create-company/:id?",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "plans",
            index: false,
            enabled: false,
            children: [
                { path: "create-plan/:planId?", index: false, enabled: true },
            ],
            },
            {
            path: "operators",
            index: false,
            enabled: false,
            children: [
                {
                path: "create-operator",
                index: false,
                enabled: false,
                },
                {
                path: "edit-operator",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "cameras",
            index: false,
            enabled: true,
            children: [
                {
                path: "add-camera",
                index: false,
                enabled: true,
                },
                {
                path: "map",
                index: false,
                enabled: true,
                },
            ],
            },
            {
            path: "camera-groups",
            index: false,
            enabled: false,
            },
            {
            path: "cameras-aliveness-log",
            index: false,
            enabled: false,
            },
            { path: "actions-log", index: false, enabled: false },
            {
            path: "log/:logType",
            index: false,
            enabled: true,
            },
            {
            path: "facial-recognition",
            index: false,
            enabled: false,
            children: [
                {
                path: "create-facial-rec-person",
                index: false,
                enabled: false,
                },
                {
                path: "create-facial-rec-person-group",
                index: false,
                enabled: false,
                },
                {
                path: "persons/:personId/upload-faces",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "forense",
            index: false,
            enabled: false,
            children: [
                {
                path: "map",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "lpr",
            index: false,
            enabled: false,
            children: [
                {
                path: "blacklist",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "timelapse",
            index: false,
            enabled: false,
            },
            {
            path: "io-devices",
            index: false,
            enabled: false,
            children: [
                {
                path: "create-device",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "panic",
            index: false,
            enabled: false,
            children: [
                {
                path: "create-panic",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "profile",
            index: false,
            enabled: false,
            },
            {
            path: "help",
            index: false,
            enabled: false,
            },
            {
            path: "feedback",
            index: false,
            enabled: false,
            },
            {
            path: "dispatchers",
            index: false,
            enabled: false,
            children: [
                {
                path: "create-dispatcher/:id?",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "vms",
            index: false,
            enabled: false,
            children: [
                {
                path: "create-vms/:id?",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "moni",
            index: false,
            enabled: false,
            children: [
                {
                path: "create-moni/:id?",
                index: false,
                enabled: false,
                },
            ],
            },
            {
            path: "themes",
            index: false,
            enabled: true,
            children: [
                {
                path: "edit-theme/:id",
                index: false,
                enabled: true,
                },
            ],
            },
        ],
        monitoringRotues: [
            {
            path: "monitor",
            index: true,
            enabled: false,
            children: [
                {
                path: "default/:playAudio?/:cameras?/:panicCameras?",
                index: false,
                enabled: false,
                },
                {
                path: "events/:playAudio?/:cameras?/:panicCameras?",
                index: false,
                enabled: false,
                },
            ],
            },
        ],
        },
    },
    };