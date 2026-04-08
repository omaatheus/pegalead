export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo o que não é dígito
    .slice(0, 11) // Limita a 11 caracteres
    .replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos 2 primeiros dígitos
    .replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen antes dos últimos 4 dígitos
};

// Máscara para CNPJ
export const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo o que não é dígito
    .slice(0, 14) // Limita a 14 caracteres
    .replace(/^(\d{2})(\d)/, '$1.$2') // Coloca ponto após os primeiros 2 dígitos
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Coloca ponto após os próximos 3 dígitos
    .replace(/\.(\d{3})(\d)/, '.$1/$2') // Coloca a barra
    .replace(/(\d{4})(\d)/, '$1-$2'); // Coloca o hífen
};