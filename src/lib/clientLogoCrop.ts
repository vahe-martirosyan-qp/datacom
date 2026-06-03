/** Display frame on the public site (`SiteClients` CSS). */
export const CLIENT_LOGO_DISPLAY_MAX_W = 280;
export const CLIENT_LOGO_DISPLAY_MAX_H = 104;

/** Crop aspect matches the logo cell (width / height). */
export const CLIENT_LOGO_CROP_ASPECT =
  CLIENT_LOGO_DISPLAY_MAX_W / CLIENT_LOGO_DISPLAY_MAX_H;

/** Exported crop size (2× display for retina). */
export const CLIENT_LOGO_CROP_OUTPUT_WIDTH = CLIENT_LOGO_DISPLAY_MAX_W * 2;

export const CLIENT_LOGO_CROP_MIME = "image/png" as const;
