/**
 * Formata uma data ISO para formato brasileiro (DD/MM/YYYY)
 */
export function formatDateBR(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Retorna a string original se não for uma data válida
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Formata uma data ISO para formato brasileiro com hora (DD/MM/YYYY HH:MM)
 */
export function formatDateTimeBR(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
}

/**
 * Converte uma data para formato ISO date-time para uso na API
 */
export function toISODateTime(date: Date): string {
  return date.toISOString();
}

/**
 * Converte uma data para formato ISO date (YYYY-MM-DD)
 */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Valida se uma string é uma data válida
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

