const ERROR_TRANSLATIONS: Record<string, string> = {
  "O campo razão social já está sendo utilizado.": "Este CNPJ já foi registrado.",
  "O campo identifier já está sendo utilizado.": "Este CNPJ já foi registrado.",
  "O campo email já está sendo utilizado.": "Este e-mail já está em uso por outro usuário.",
  "O campo telefone não é um celular com DDD válido.": "Insira um número de celular com DDD válido.",
};

const FALLBACK_ERROR_MESSAGE = "Verifique as informações preenchidas neste campo.";

export const translateError = (backendMessage: string): string => {
  return ERROR_TRANSLATIONS[backendMessage] || FALLBACK_ERROR_MESSAGE;
};

export const getTranslatedFieldError = (apiFieldErrors?: string[]): string[] | undefined => {
  if (!apiFieldErrors || apiFieldErrors.length === 0) return undefined;
  
  const translatedMessage = translateError(apiFieldErrors[0]);
  return [translatedMessage];
};