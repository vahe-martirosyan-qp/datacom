/** CMS href values that open the contact lead modal instead of navigating away. */
export function shouldOpenLeadFormModal(href: string): boolean {
  const h = href.trim().toLowerCase();
  if (!h || h === "contacts" || h === "contact") {
    return true;
  }
  if (h === "#contacts" || h === "#contact" || h === "#lead") {
    return true;
  }
  return false;
}
