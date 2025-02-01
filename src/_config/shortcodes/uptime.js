/**
 *
 * @param {String} birthDate in format 'YYYY-MM-DD'
 * @returns {Object} with years, months, and days
 */
function uptime(birthDate) {
  const start = new Date(birthDate);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (days < 0) {
    months--;
    const tempDate = new Date(now.getFullYear(), now.getMonth(), 0);
    days += tempDate.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {years, months, days};
}

/**
 *
 * @param {String} birthDate in format 'YYYY-MM-DD'
 * @returns {String}
 */
export function uptimeShortcode(birthDate) {
  const {years, months, days} = uptime(birthDate);

  return `${years} years, ${months} months, and ${days} days`;
}
