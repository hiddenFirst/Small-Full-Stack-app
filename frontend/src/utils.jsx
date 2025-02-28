/**
 *
 * @param {string} dateString - email received time
 * @returns {string} Formatted time（ex: "Yesterday", "Feb 2", "2023"）
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {month: 'short', day: '2-digit'};
  return date.toLocaleDateString('en-US', options).replace(',', '');
}

