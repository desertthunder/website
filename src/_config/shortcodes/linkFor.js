export function linkForShortcode(url, text) {
  if (!text) {
    return `<a href="${url}" target="_blank">${url}</a>`;
  }

  return `<a href="${url}" target="_blank">${text}</a>`;
}
