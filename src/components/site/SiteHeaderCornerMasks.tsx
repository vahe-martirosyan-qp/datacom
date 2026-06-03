import styles from "./SiteHeaderCornerMasks.module.scss";

/** Smarteq-style L-shaped masks (inline SVG paths, not solid CSS rectangles). */
export function SiteHeaderCornerMasks() {
  return (
    <div className={styles.siteHeaderCornerMasks} aria-hidden>
      <svg
        className={`${styles.siteHeaderCornerMasks__svg} ${styles["siteHeaderCornerMasks__svg--start"]}`}
        viewBox="0 0 40 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M40 0H0V120C0 97.9874 17.9089 80.1429 40 80.1429V0Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className={`${styles.siteHeaderCornerMasks__svg} ${styles["siteHeaderCornerMasks__svg--end"]}`}
        viewBox="0 0 40 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0H40V120C40 97.9874 22.0911 80.1429 0 80.1429V0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
