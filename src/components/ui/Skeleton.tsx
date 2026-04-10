import styles from "./Skeleton.module.scss";

type SkeletonVariant = "text" | "title" | "button" | "image" | "card";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

export function Skeleton({ variant = "text", className }: SkeletonProps) {
  const modifier = styles[`skeleton--${variant}` as keyof typeof styles];
  return (
    <span
      className={`${styles.skeleton} ${modifier ?? ""} ${className ?? ""}`}
      aria-hidden
    />
  );
}
