/**
 * Client-side CMS logs (browser DevTools → Console, not the terminal).
 * On by default. Set `NEXT_PUBLIC_CMS_SILENCE_CMS_LOGS=1` to disable.
 */
export function logCmsDebug(scope: string, payload: unknown): void {
  if (process.env.NEXT_PUBLIC_CMS_SILENCE_CMS_LOGS === "1") {
    return;
  }
  console.info(`[datacom CMS ▶ ${scope}]`, payload);
}
