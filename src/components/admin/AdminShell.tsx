"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import styles from "./AdminShell.module.scss";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const isLogin =
    pathname === "/admin/login" || pathname.startsWith("/admin/login/");

  if (isLogin) {
    return <div className={styles.adminShell}>{children}</div>;
  }

  return (
    <div className={styles.adminShell}>
      <AdminSidebar />
      <main className={styles.adminShell__main}>{children}</main>
    </div>
  );
}
