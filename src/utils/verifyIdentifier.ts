import { cnpj } from "cpf-cnpj-validator";

export function verifyIdentifier(identifier: string) {
    if (!cnpj.isValid(identifier)) {
        throw new Error("Formato de CNPJ inválido ou número incorreto.");
        }
}