export function displayOrDash(value?: string | null): string {
  return value && value.trim().length > 0 ? value : "N/A";
}
