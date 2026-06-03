export function leadSubmitErrorMessage(lang: string): string {
  return lang === "ru"
    ? "Не удалось отправить заявку. Попробуйте позже."
    : "Could not send your request. Please try again later.";
}

export function leadSubmittingLabel(lang: string): string {
  return lang === "ru" ? "Отправка…" : "Sending…";
}

export function leadConsentErrorMessage(lang: string): string {
  return lang === "ru"
    ? "Отметьте обязательные согласия перед отправкой."
    : "Please accept the required agreements before submitting.";
}
