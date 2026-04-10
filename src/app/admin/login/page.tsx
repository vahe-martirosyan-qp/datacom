"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLoginMutation } from "@/hooks/useLoginMutation";
import styles from "./LoginPage.module.scss";

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("datacom");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const mutation = useLoginMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(
      { login, password },
      {
        onSuccess: () => {
          router.push("/admin/dashboard");
        },
        onError: (err) => {
          if (isAxiosError(err)) {
            const data = err.response?.data as { error?: string } | undefined;
            setError(data?.error ?? "Неверный логин или пароль");
          } else {
            setError("Неверный логин или пароль");
          }
        },
      }
    );
  };

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginPage__form} onSubmit={handleSubmit}>
        <h1 className={styles.loginPage__title}>Вход в панель</h1>
        <label className={styles.loginPage__field}>
          <span className={styles.loginPage__label}>Логин</span>
          <input
            name="login"
            className={styles.loginPage__input}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className={styles.loginPage__field}>
          <span className={styles.loginPage__label}>Пароль</span>
          <input
            name="password"
            type="password"
            className={styles.loginPage__input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className={styles.loginPage__error}>{error}</p> : null}
        <button
          type="submit"
          className={styles.loginPage__submit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Вход…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
