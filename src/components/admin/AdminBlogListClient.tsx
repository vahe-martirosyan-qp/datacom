"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { blogKeySegmentFromCardHref } from "@/lib/blogHrefUtils";
import { entriesToMap, parseJsonArray } from "@/lib/contentUtils";
import { useBlogContentQuery } from "@/hooks/useBlogContentQuery";
import { useHomeContentQuery } from "@/hooks/useHomeContentQuery";
import type { BlogTeaserPost } from "@/types/site";
import { api } from "@/lib/api";
import styles from "./AdminOverview.module.scss";

function getApiErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { error?: string } } }).response;
    const msg = r?.data?.error;
    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }
  }
  return "Не удалось выполнить запрос. Проверьте сеть и авторизацию.";
}

function blogSlugsFromContentMap(map: Record<string, string>): string[] {
  const slugs = new Set<string>();
  for (const key of Object.keys(map)) {
    const m = key.match(/^blog\.([^.]+)\./);
    if (m?.[1]) {
      slugs.add(m[1]);
    }
  }
  return [...slugs];
}

export function AdminBlogListClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const blogQuery = useBlogContentQuery("ru");
  const homeQuery = useHomeContentQuery("ru");
  const [title, setTitle] = useState("");
  const [addToBlogIndex, setAddToBlogIndex] = useState(true);
  const [addToHomeTeaser, setAddToHomeTeaser] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const createPost = useMutation({
    mutationFn: async (payload: {
      title: string;
      addToBlogIndex: boolean;
      addToHomeTeaser: boolean;
    }) => {
      const { data } = await api.post<{ ok: boolean; slug: string }>(
        "/admin/blog-posts",
        payload
      );
      if (!data?.slug) {
        throw new Error("NO_SLUG");
      }
      return data.slug;
    },
    onError: (err) => {
      if (err instanceof Error && err.message === "NO_SLUG") {
        setFormError("Сервер не вернул slug. Обновите страницу и попробуйте снова.");
        return;
      }
      setFormError(getApiErrorMessage(err));
    },
    onSuccess: async (slug) => {
      setFormError(null);
      setTitle("");
      await queryClient.invalidateQueries({ queryKey: ["content", "blog"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "blogPost"] });
      await router.push(`/admin/blog/${encodeURIComponent(slug)}`);
    },
  });

  const deletePost = useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(`/admin/blog-posts/${encodeURIComponent(slug)}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content", "blog"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "home"] });
      await queryClient.invalidateQueries({ queryKey: ["content", "blogPost"] });
    },
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setFormError("Укажите заголовок новой статьи.");
      return;
    }
    if (createPost.isPending) {
      return;
    }
    createPost.mutate({
      title: trimmed,
      addToBlogIndex,
      addToHomeTeaser,
    });
  };

  const handleDelete = (slug: string, label: string) => {
    if (
      !window.confirm(
        `Полностью удалить статью «${label}» (${slug}) для всех языков? ` +
          `Сотрутся ключи blog.${slug}.* и карточки в page.blog.posts / home.blog.posts.`
      )
    ) {
      return;
    }
    deletePost.mutate(slug);
  };

  const { posts } = useMemo(() => {
    const blogMap = blogQuery.data
      ? entriesToMap(blogQuery.data.entries)
      : {};
    const homeMap = homeQuery.data ? entriesToMap(homeQuery.data.entries) : {};

    const bySlug = new Map<string, { slug: string; title: string; thumb: string }>();

    const items = parseJsonArray<BlogTeaserPost>(
      blogMap["page.blog.posts"] ?? "[]",
      []
    );
    for (const item of items) {
      const slug = blogKeySegmentFromCardHref(item.href);
      if (!slug) {
        continue;
      }
      bySlug.set(slug, {
        slug,
        title: item.title?.trim() || slug,
        thumb: item.imageUrl?.trim() ?? "",
      });
    }

    for (const slug of blogSlugsFromContentMap(homeMap)) {
      if (bySlug.has(slug)) {
        continue;
      }
      const title =
        homeMap[`blog.${slug}.title`]?.trim() ||
        blogMap[`blog.${slug}.title`]?.trim() ||
        slug;
      const thumb =
        homeMap[`blog.${slug}.heroImage`]?.trim() ||
        blogMap[`blog.${slug}.heroImage`]?.trim() ||
        "";
      bySlug.set(slug, { slug, title, thumb });
    }

    const out = [...bySlug.values()].sort((a, b) =>
      a.title.localeCompare(b.title, "ru")
    );
    return { posts: out };
  }, [blogQuery.data, homeQuery.data]);

  const isListLoading = blogQuery.isLoading || homeQuery.isLoading;

  if (blogQuery.isError || homeQuery.isError) {
    return (
      <div className={styles.adminOverview}>
        <p className={styles.adminOverview__lead}>
          Не удалось загрузить список. Обновите страницу.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.adminOverview}>
      <h1 className={styles.adminOverview__title}>Блог — статьи</h1>
      <p className={styles.adminOverview__lead}>
        <strong>Текст каждой статьи</strong> (TipTap, обложка, оборудование) —
        откройте статью в списке ниже → блок{" "}
        <strong>«Текст статьи»</strong>. Создайте новую статью формой ниже.
        Настройки страницы списка <code>/blog</code> — в конце этой страницы.
      </p>

      <form
        className={styles.adminProjectsCreate}
        onSubmit={handleCreate}
        aria-label="Новая статья"
        noValidate
      >
        <label className={styles.adminProjectsCreate__field}>
          <span className={styles.adminProjectsCreate__label}>
            Заголовок новой статьи
          </span>
          <input
            className={styles.adminProjectsCreate__input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Akyan Hotel St.Petersburg"
          />
        </label>
        <label className={styles.adminProjectsCreate__check}>
          <input
            type="checkbox"
            checked={addToBlogIndex}
            onChange={(e) => setAddToBlogIndex(e.target.checked)}
          />
          <span>Добавить карточку на страницу /blog</span>
        </label>
        <label className={styles.adminProjectsCreate__check}>
          <input
            type="checkbox"
            checked={addToHomeTeaser}
            onChange={(e) => setAddToHomeTeaser(e.target.checked)}
          />
          <span>Добавить в блок «Блог» на главной</span>
        </label>
        {formError ? (
          <p className={styles.adminProjectsCreate__error} role="alert">
            {formError}
          </p>
        ) : null}
        <button
          type="submit"
          className={styles.adminOverview__editBtn}
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Создание…" : "Создать статью"}
        </button>
      </form>

      {isListLoading ? (
        <div className={styles.adminOverview__skeleton}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className={styles.adminOverview__lead}>
          Пока нет статей. Создайте статью формой выше — после создания откроется
          редактор с блоком «Текст статьи» (TipTap).
        </p>
      ) : (
        <>
          <h2
            className={styles.adminOverview__title}
            style={{ fontSize: "var(--text-xl)", marginTop: "var(--space-10)" }}
          >
            Статьи
          </h2>
          <ul className={styles.adminProjectsList}>
            {posts.map((post) => (
              <li key={post.slug} className={styles.adminProjectsList__item}>
                <div className={styles.adminProjectsList__row}>
                  <div
                    className={styles.adminProjectsList__thumbWrap}
                    aria-hidden
                  >
                    {post.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element -- admin preview
                      <img
                        src={post.thumb}
                        alt=""
                        className={styles.adminProjectsList__thumb}
                      />
                    ) : (
                      <div
                        className={styles.adminProjectsList__thumbPlaceholder}
                      />
                    )}
                  </div>
                  <Link
                    href={`/admin/blog/${encodeURIComponent(post.slug)}`}
                    className={styles.adminProjectsList__link}
                  >
                    {post.title}
                    <span className={styles.adminProjectsList__slug}>
                      {post.slug}
                    </span>
                  </Link>
                  <Link
                    href={`/admin/blog/${encodeURIComponent(post.slug)}`}
                    className={styles.adminProjectsList__edit}
                  >
                    Текст статьи (TipTap)
                  </Link>
                  <button
                    type="button"
                    className={styles.adminProjectsList__delete}
                    disabled={deletePost.isPending}
                    onClick={() => handleDelete(post.slug, post.title)}
                  >
                    {deletePost.isPending && deletePost.variables === post.slug
                      ? "Удаление…"
                      : "Удалить"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
