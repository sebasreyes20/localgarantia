/**
 * Formatea una fecha en formato legible
 * @param {string} dateString - Fecha en formato ISO
 * @param {string} locale - Locale para el formato (por defecto es-ES)
 * @returns {string} Fecha formateada
 */
export function formatDate(dateString, locale = "es-ES") {
  if (!dateString) return "-"
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

/**
 * Genera un ID único
 * @param {string} prefix - Prefijo para el ID
 * @returns {string} ID único
 */
export function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`
}

/**
 * Combina clases CSS condicionales
 * @param {string[]} classes - Clases CSS
 * @returns {string} Clases combinadas
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Obtiene el color de estado para una garantía
 * @param {string} status - Estado de la garantía
 * @returns {object} Objeto con clases CSS para el estado
 */
export function getStatusColor(status) {
  switch (status) {
    case "pending":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
        darkBg: "dark:bg-yellow-900",
        darkText: "dark:text-yellow-300",
        darkBorder: "dark:border-yellow-800",
      }
    case "approved":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        darkBg: "dark:bg-green-900",
        darkText: "dark:text-green-300",
        darkBorder: "dark:border-green-800",
      }
    case "rejected":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
        darkBg: "dark:bg-red-900",
        darkText: "dark:text-red-300",
        darkBorder: "dark:border-red-800",
      }
    case "completed":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
        darkBg: "dark:bg-blue-900",
        darkText: "dark:text-blue-300",
        darkBorder: "dark:border-blue-800",
      }
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        darkBg: "dark:bg-gray-900",
        darkText: "dark:text-gray-300",
        darkBorder: "dark:border-gray-800",
      }
  }
}
