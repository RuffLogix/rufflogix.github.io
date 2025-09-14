/**
 * Parse various date formats and return a Date object
 */
function parseDate(dateStr: string): Date {
  // Handle "Present" case
  if (dateStr.toLowerCase() === "present") {
    return new Date();
  }

  // Handle "MMM YYYY" format (e.g., "Jan 2024", "Feb 2024")
  const monthYearRegex = /^([A-Za-z]{3})\s+(\d{4})$/;
  const monthYearMatch = dateStr.match(monthYearRegex);
  if (monthYearMatch) {
    const [, monthStr, yearStr] = monthYearMatch;
    const monthNames = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const monthIndex = monthNames.indexOf(monthStr.toLowerCase());
    if (monthIndex !== -1) {
      return new Date(parseInt(yearStr), monthIndex, 1);
    }
  }

  // Handle "YYYY" format
  const yearRegex = /^(\d{4})$/;
  const yearMatch = dateStr.match(yearRegex);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1]), 0, 1); // January 1st of the year
  }

  // Fallback to Date parsing
  return new Date(dateStr);
}

/**
 * Calculate the duration between two dates in a human-readable format
 */
export function calculateDuration(
  startDateStr: string,
  endDateStr: string
): string {
  const startDate = parseDate(startDateStr.trim());
  const endDate = parseDate(endDateStr.trim());

  // Calculate the difference in months
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();

  let totalMonths = yearDiff * 12 + monthDiff;

  // If we're still in the same month but the end date hasn't passed the start date,
  // we still count it as 1 month (inclusive)
  if (totalMonths === 0) {
    totalMonths = 1;
  } else if (totalMonths > 0 && endDate.getDate() >= startDate.getDate()) {
    // Include the current month if we've passed the start date
    totalMonths += 1;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    const yearText = years === 1 ? "1 yr" : `${years} yrs`;
    const monthText = months === 1 ? "1 mo" : `${months} mos`;
    return `${yearText} ${monthText}`;
  } else if (years > 0) {
    return years === 1 ? "1 yr" : `${years} yrs`;
  } else {
    return months === 1 ? "1 mo" : `${months} mos`;
  }
}

/**
 * Parse a duration string and calculate the total duration
 */
export function parseDurationString(durationStr: string): string {
  // Handle different duration string formats
  // Examples: "2023 - Present", "May 2025 - Jul 2025", "Jan 2024 - Feb 2024"

  const parts = durationStr.split(" - ");
  if (parts.length !== 2) {
    return "";
  }

  const [startStr, endStr] = parts;
  return calculateDuration(startStr, endStr);
}
