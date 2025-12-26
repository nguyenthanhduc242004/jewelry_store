/**
 * Converts a date string in 'YYYY-MM-DD' format to 'DayOfWeek, YYYY-MM-DD' format
 * @param dateString - Date string in 'YYYY-MM-DD' format
 * @returns Formatted date string like "Monday, YYYY-MM-DD"
 * @example
 * formatDateWithDay('2025-12-26') // Returns "Friday, 2025-12-26"
 */
export function formatDateWithDay(dateString: string): string {
  const date = new Date(dateString);

  // Get the day of the week
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

  // Return formatted string
  return `${dayOfWeek}, ${dateString}`;
}
