/* Gestão de artigos sobre saúde íntima feminina. */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { toast } from "sonner";

type View = "overview" | "articles" | "editor";
type ArticleStatus = "Rascunho" | "Publicado";

type Article = {
  id: string;
  ownerId: string;
  author: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: ArticleStatus;
  content: string;
  updatedAt: string;
  createdAt: string;
};

type ArticleFields = Pick<
  Article,
  "title" | "slug" | "excerpt" | "category" | "content" | "status"
>;

const EMPTY_CONTENT = "<p>Comece a escrever a sua história aqui...</p>";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as
    | { error?: string }
    | T
    | null;
  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? body.error
        : undefined;
    throw new Error(message || "Não foi possível concluir a operação.");
  }

  return body as T;
}

async function loadArticles(query: string, signal?: AbortSignal) {
  return requestJson<{ articles: Article[] }>(
    `/api/articles/search?q=${encodeURIComponent(query)}`,
    { signal }
  );
}

function BIcon({ name, className = "" }: { name: string; className?: string }) {
  return <i className={`bi bi-${name} ${className}`} aria-hidden="true" />;
}

function canManageArticle(article: Article, viewerId: string | null) {
  return Boolean(viewerId && article.ownerId === viewerId);
}

function formatArticleDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function StatusBadge({ status }: { status: ArticleStatus }) {
  const badgeClass =
    status === "Publicado" ? "text-bg-success" : "text-bg-secondary";

  return (
    <span className={`badge rounded-pill ${badgeClass}`}>
      <span className="me-1">●</span>
      {status}
    </span>
  );
}

function IconButton({
  label,
  children,
  onClick,
  className = "btn-outline-secondary",
  disabled = false,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-sm ${className}`}
    >
      {children}
    </button>
  );
}

function Topbar({
  activeView,
  onNavigate,
}: {
  activeView: View;
  onNavigate: (view: View) => void;
}) {
  return (
    <header className="navbar navbar-expand-md bg-white border-bottom shadow-sm px-3 px-lg-5 py-3">
      <div className="container-fluid p-0 position-relative">
        <nav
          className="navbar-nav flex-row gap-1 gap-md-2 position-absolute top-50 start-50 translate-middle d-none d-md-flex text-nowrap"
          aria-label="Navegação principal"
        >
          <button
            type="button"
            onClick={() => onNavigate("overview")}
            className={`nav-link px-2 px-md-3 ${activeView === "overview" ? "active text-danger" : "text-secondary"}`}
          >
            Visão geral
          </button>
          <button
            type="button"
            onClick={() => onNavigate("articles")}
            className={`nav-link px-2 px-md-3 ${activeView === "articles" ? "active text-danger" : "text-secondary"}`}
          >
            Artigos
          </button>
        </nav>

        <div className="d-flex align-items-center justify-content-end gap-2 w-100">
          <span className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center fw-bold p-2">
            MC
          </span>
        </div>
      </div>
    </header>
  );
}

function ArticleRow({
  article,
  viewerId,
  onEdit,
  onDelete,
}: {
  article: Article;
  viewerId: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const canManage = canManageArticle(article, viewerId);

  return (
    <div className="list-group-item p-3 p-lg-4">
      <div className="row g-3 align-items-center">
        <div className={canManage ? "col-12 col-md-9" : "col-12"}>
          {canManage ? (
            <button
              type="button"
              className="btn btn-link link-dark fw-bold p-0 text-start text-decoration-none"
              onClick={onEdit}
            >
              {article.title}
            </button>
          ) : (
            <span className="fw-bold">{article.title}</span>
          )}
          <p className="small text-secondary mb-2">{article.excerpt}</p>
          <small className="text-secondary d-block mb-1">
            <BIcon name="person" /> Por {article.author}
          </small>
          <small className="text-secondary d-flex flex-wrap gap-3">
            <span>{formatArticleDate(article.updatedAt)}</span>
          </small>
        </div>

        {canManage && (
          <div className="col-12 col-md-3 d-flex flex-row flex-md-column align-items-start align-items-md-end justify-content-between gap-2">
            <StatusBadge status={article.status} />
            <div className="d-flex gap-1">
              <IconButton label="Editar artigo" onClick={onEdit}>
                <BIcon name="pencil" />
              </IconButton>
              <IconButton
                label="Excluir artigo"
                className="btn-outline-danger"
                onClick={onDelete}
              >
                <BIcon name="trash3" />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center p-5 text-secondary">
      <BIcon name="inbox" className="fs-3" />
      <p className="mb-0 mt-3">{message}</p>
    </div>
  );
}

function DashboardView({
  articles,
  viewerId,
  onEdit,
  onDelete,
  onNew,
  onNavigate,
  isLoading,
  error,
}: {
  articles: Article[];
  viewerId: string | null;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
  onNew: () => void;
  onNavigate: (view: View) => void;
  isLoading: boolean;
  error: boolean;
}) {
  const visibleArticles = articles.filter(
    article =>
      article.status === "Publicado" || canManageArticle(article, viewerId)
  );
  const managedArticles = articles.filter(article =>
    canManageArticle(article, viewerId)
  );
  const published = managedArticles.filter(
    article => article.status === "Publicado"
  ).length;
  const drafts = managedArticles.filter(
    article => article.status === "Rascunho"
  ).length;

  return (
    <main className="container-fluid px-3 px-lg-5 py-4 py-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <small className="text-danger text-uppercase fw-bold">
            Painel de gestão
          </small>
          <h1 className="fw-bold mt-2 mb-1">Conteúdos de saúde íntima</h1>
        </div>
        <button
          type="button"
          className="btn btn-danger d-inline-flex align-items-center gap-2"
          onClick={onNew}
        >
          <BIcon name="plus-lg" />
          Novo artigo
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card h-100 border shadow-sm">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="bg-success-subtle text-success rounded p-3">
                <BIcon name="check2-circle" />
              </div>
              <div>
                <small className="text-secondary d-block">Publicados</small>
                <strong className="fs-3 d-block">{published}</strong>
                <small className="text-secondary">
                  Seus conteúdos publicados
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100 border shadow-sm">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="bg-secondary-subtle text-secondary rounded p-3">
                <BIcon name="file-earmark-text" />
              </div>
              <div>
                <small className="text-secondary d-block">Rascunhos</small>
                <strong className="fs-3 d-block">{drafts}</strong>
                <small className="text-secondary">
                  Visíveis somente para você
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="card border shadow-sm">
        <div className="card-header bg-white p-3 p-lg-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <small className="text-dark text-uppercase fw-bold">
              Biblioteca de conteúdos
            </small>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onNavigate("articles")}
            >
              <BIcon name="list-ul" />
              Ver biblioteca completa
            </button>
          </div>
        </div>

        <div className="list-group list-group-flush">
          {isLoading ? (
            <EmptyState message="Carregando artigos..." />
          ) : error ? (
            <EmptyState message="Não foi possível carregar os artigos." />
          ) : visibleArticles.length ? (
            visibleArticles.map(article => (
              <ArticleRow
                key={article.id}
                article={article}
                viewerId={viewerId}
                onEdit={() => onEdit(article)}
                onDelete={() => onDelete(article)}
              />
            ))
          ) : (
            <EmptyState message="Nenhum artigo disponível." />
          )}
        </div>
      </section>
    </main>
  );
}

function ArticlesView({
  articles,
  viewerId,
  query,
  onQueryChange,
  onEdit,
  onDelete,
  onNew,
  isLoading,
  error,
}: {
  articles: Article[];
  viewerId: string | null;
  query: string;
  onQueryChange: (query: string) => void;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
  onNew: () => void;
  isLoading: boolean;
  error: boolean;
}) {
  const [filter, setFilter] = useState<"Todos" | ArticleStatus>("Todos");
  const [authorFilter, setAuthorFilter] = useState("Todos");

  const visibleArticles = useMemo(
    () =>
      articles.filter(
        article =>
          article.status === "Publicado" || canManageArticle(article, viewerId)
      ),
    [articles, viewerId]
  );

  const authors = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set(visibleArticles.map(article => article.author))),
    ],
    [visibleArticles]
  );

  const filtered = useMemo(
    () =>
      visibleArticles.filter(article => {
        const matchesStatus =
          filter === "Todos" ||
          (canManageArticle(article, viewerId) && article.status === filter);
        const matchesAuthor =
          authorFilter === "Todos" || article.author === authorFilter;

        return matchesStatus && matchesAuthor;
      }),
    [authorFilter, filter, viewerId, visibleArticles]
  );

  const clearFilters = () => {
    onQueryChange("");
    setFilter("Todos");
    setAuthorFilter("Todos");
  };

  return (
    <main className="container-fluid px-3 px-lg-5 py-4 py-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <small className="text-danger text-uppercase fw-bold">
            Biblioteca editorial
          </small>
          <h1 className="fw-bold mt-2 mb-1">Artigos</h1>
          <p className="text-secondary mb-0">
            Consulte conteúdos publicados e gerencie os seus artigos.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-danger d-inline-flex align-items-center gap-2"
          onClick={onNew}
        >
          <BIcon name="plus-lg" />
          Novo artigo
        </button>
      </div>

      <div className="card border shadow-sm">
        <div className="card-body border-bottom">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-lg-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <BIcon name="search" />
                </span>
                <input
                  className="form-control"
                  value={query}
                  onChange={event => onQueryChange(event.target.value)}
                  placeholder="Buscar por título, tema ou autor"
                  aria-label="Buscar artigos"
                />
                {query && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => onQueryChange("")}
                  >
                    <BIcon name="x-lg" />
                  </button>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                <select
                  className="form-select form-select-sm w-auto"
                  value={authorFilter}
                  onChange={event => setAuthorFilter(event.target.value)}
                  aria-label="Filtrar por autor"
                >
                  {authors.map(author => (
                    <option key={author} value={author}>
                      {author === "Todos" ? "Todos os autores" : author}
                    </option>
                  ))}
                </select>

                <div className="d-flex flex-wrap gap-1">
                  {(["Todos", "Publicado", "Rascunho"] as const).map(item => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`btn btn-sm ${filter === item ? "btn-danger" : "btn-outline-secondary"}`}
                    >
                      {item}
                      {item !== "Todos" && (
                        <span className="badge rounded-pill ms-1">
                          {
                            visibleArticles.filter(
                              article =>
                                canManageArticle(article, viewerId) &&
                                article.status === item
                            ).length
                          }
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 pt-3 pb-2 small text-secondary">
          {filtered.length} {filtered.length === 1 ? "artigo" : "artigos"}
        </div>

        <div className="list-group list-group-flush">
          {isLoading ? (
            <EmptyState message="Buscando artigos..." />
          ) : error ? (
            <EmptyState message="Não foi possível consultar a biblioteca." />
          ) : filtered.length ? (
            filtered.map(article => (
              <ArticleRow
                key={article.id}
                article={article}
                viewerId={viewerId}
                onEdit={() => onEdit(article)}
                onDelete={() => onDelete(article)}
              />
            ))
          ) : (
            <div className="text-center p-5">
              <BIcon name="search" className="fs-3 text-secondary" />
              <h3 className="h5 mt-3">Nenhum artigo encontrado</h3>
              <p className="text-secondary">
                Tente buscar por outro termo ou limpe os filtros.
              </p>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={clearFilters}
              >
                Limpar busca
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Cole a URL do link");

    if (url) {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Cole a URL da imagem");

    if (url) {
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: "Imagem inserida no artigo" })
        .run();
    }
  };

  const addVideo = () => {
    const url = window.prompt("Cole a URL do vídeo do YouTube");

    if (url) {
      editor
        .chain()
        .focus()
        .setYoutubeVideo({ src: url, width: 640, height: 360 })
        .run();
    }
  };

  const onLocalImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result, alt: file.name })
          .run();
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const isActive = (name: string, attributes?: Record<string, unknown>) =>
    editor.isActive(name, attributes);

  const headingLevels = [1, 2, 3, 4, 5, 6] as const;
  const activeHeading = headingLevels.find(level =>
    isActive("heading", { level })
  );

  const setTextStyle = (value: string) => {
    if (value === "p") {
      editor.chain().focus().setParagraph().run();
      return;
    }

    editor
      .chain()
      .focus()
      .toggleHeading({
        level: Number(value.slice(1)) as (typeof headingLevels)[number],
      })
      .run();
  };

  return (
    <div className="d-flex align-items-center gap-1 flex-wrap p-2 bg-light border-bottom">
      <select
        className="form-select form-select-sm w-auto"
        value={activeHeading ? `h${activeHeading}` : "p"}
        onChange={event => setTextStyle(event.target.value)}
        aria-label="Estilo de parágrafo"
      >
        <option value="p">Corpo</option>
        {headingLevels.map(level => (
          <option key={level} value={`h${level}`}>
            Título {level}
          </option>
        ))}
      </select>

      <div className="btn-group btn-group-sm">
        <IconButton
          label="Negrito"
          className={isActive("bold") ? "btn-danger" : "btn-outline-secondary"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BIcon name="type-bold" />
        </IconButton>
        <IconButton
          label="Itálico"
          className={
            isActive("italic") ? "btn-danger" : "btn-outline-secondary"
          }
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <BIcon name="type-italic" />
        </IconButton>
        <IconButton
          label="Sublinhado"
          className={
            isActive("underline") ? "btn-danger" : "btn-outline-secondary"
          }
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <BIcon name="type-underline" />
        </IconButton>
      </div>

      <div className="btn-group btn-group-sm">
        <IconButton
          label="Lista com marcadores"
          className={
            isActive("bulletList") ? "btn-danger" : "btn-outline-secondary"
          }
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <BIcon name="list-ul" />
        </IconButton>
        <IconButton
          label="Lista numerada"
          className={
            isActive("orderedList") ? "btn-danger" : "btn-outline-secondary"
          }
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <BIcon name="list-ol" />
        </IconButton>
        <IconButton
          label="Citação"
          className={
            isActive("blockquote") ? "btn-danger" : "btn-outline-secondary"
          }
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <BIcon name="chat-quote" />
        </IconButton>
      </div>

      <div className="btn-group btn-group-sm">
        <IconButton
          label="Alinhar à esquerda"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <BIcon name="text-left" />
        </IconButton>
        <IconButton
          label="Centralizar"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <BIcon name="text-center" />
        </IconButton>
        <IconButton
          label="Alinhar à direita"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <BIcon name="text-right" />
        </IconButton>
      </div>

      <span className="flex-grow-1" />

      <div className="btn-group btn-group-sm">
        <IconButton label="Inserir link" onClick={addLink}>
          <BIcon name="link-45deg" />
        </IconButton>
        <IconButton label="Inserir imagem por URL" onClick={addImage}>
          <BIcon name="image" />
        </IconButton>
        <IconButton
          label="Inserir imagem do computador"
          onClick={() => fileInputRef.current?.click()}
        >
          <BIcon name="upload" />
        </IconButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onLocalImage}
          hidden
        />
        <IconButton label="Inserir vídeo do YouTube" onClick={addVideo}>
          <BIcon name="camera-video" />
        </IconButton>
      </div>
    </div>
  );
}

function createEmptyDraft(): ArticleFields {
  return {
    title: "",
    slug: "",
    excerpt: "",
    category: "Autocuidado",
    status: "Rascunho",
    content: EMPTY_CONTENT,
  };
}

function ArticleEditor({
  article,
  authorName,
  onBack,
  onSave,
  onDelete,
}: {
  article: Article | null;
  authorName: string;
  onBack: () => void;
  onSave: (fields: ArticleFields) => void;
  onDelete: (article: Article) => void;
}) {
  const isNew = !article;
  const [draft, setDraft] = useState<ArticleFields>(() =>
    article
      ? {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          category: article.category,
          status: article.status,
          content: article.content,
        }
      : createEmptyDraft()
  );
  const [saved, setSaved] = useState(!isNew);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: true }),
      Youtube.configure({ controls: true, nocookie: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: draft.content,
    onUpdate: ({ editor: currentEditor }) => {
      setDraft(current => ({
        ...current,
        content: currentEditor.getHTML(),
      }));
      setSaved(false);
    },
    editorProps: {
      attributes: {
        class: "p-4 p-lg-5",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (article && editor && editor.getHTML() !== article.content) {
      editor.commands.setContent(article.content);
    }
  }, [article, editor]);

  const updateField = (field: keyof ArticleFields, value: string) => {
    setDraft(current => ({
      ...current,
      [field]: value,
      ...(field === "title"
        ? {
            slug: value
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          }
        : {}),
    }));
    setSaved(false);
  };

  const save = () => {
    const fields: ArticleFields = {
      ...draft,
      title: draft.title.trim() || "Sem título",
      slug: draft.slug.trim(),
      excerpt: draft.excerpt.trim(),
    };

    onSave(fields);
  };

  return (
    <main className="container-fluid px-3 px-lg-5 pb-5">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 py-3 border-bottom">
        <button
          type="button"
          className="btn btn-link text-secondary p-0"
          onClick={onBack}
        >
          <BIcon name="arrow-left" />
          Voltar aos artigos
        </button>

        <div className="d-flex align-items-center flex-wrap gap-2">
          <span className={`small ${saved ? "text-success" : "text-danger"}`}>
            <span className="me-1">●</span>
            {saved ? "Todas as alterações salvas" : "Alterações não salvas"}
          </span>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={save}
          >
            <BIcon name="check2" />
            Salvar rascunho
          </button>
        </div>
      </div>

      <div className="row justify-content-center pt-4">
        <div className="col-12 col-xl-10">
          <div className="mb-3">
            <small className="text-danger text-uppercase fw-bold">
              {isNew ? "Novo artigo" : "Edição em andamento"}
            </small>
            <input
              className="form-control form-control-lg border-0 border-bottom rounded-0 px-0 mt-2 fw-bold"
              value={draft.title}
              onChange={event => updateField("title", event.target.value)}
              placeholder="Dê um título ao artigo"
              aria-label="Título do artigo"
            />
            <input
              className="form-control form-control-sm border-0 px-0 text-secondary"
              value={`entre-nos.editorial/${draft.slug}`}
              onChange={event =>
                updateField(
                  "slug",
                  event.target.value.replace(/^entre-nos\.editorial\//, "")
                )
              }
              aria-label="Slug do artigo"
            />
            <input
              className="form-control border-0 border-bottom rounded-0 px-0 mt-3"
              value={draft.excerpt}
              onChange={event => updateField("excerpt", event.target.value)}
              placeholder="Escreva um resumo curto para a biblioteca"
              aria-label="Resumo do artigo"
            />
            <small className="text-secondary d-block mt-2">
              <BIcon name="person" /> {authorName}
            </small>
          </div>

          <div className="card border shadow-sm overflow-hidden">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>

          {!isNew && article && (
            <div className="d-flex justify-content-end align-items-center border-top pt-3">
              <button
                type="button"
                className="btn btn-link text-danger px-0"
                onClick={() => onDelete(article)}
              >
                <BIcon name="trash3" />
                Excluir artigo
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function DeleteModal({
  article,
  onCancel,
  onConfirm,
}: {
  article: Article;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="modal-backdrop show" aria-hidden="true" />
      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-article-title"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h2 id="delete-article-title" className="modal-title h5">
                Excluir este artigo?
              </h2>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                aria-label="Fechar"
              />
            </div>
            <div className="modal-body">
              <p className="mb-0">
                “{article.title || "Sem título"}” será removido da biblioteca.
                Essa ação não pode ser desfeita.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
              >
                Excluir artigo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const { user } = useAuth();
  const viewerId = user?.openId ?? null;
  const authorName = user?.name || user?.email || "Usuário";
  const [activeView, setActiveView] = useState<View>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setHasError(false);

    loadArticles(searchQuery, controller.signal)
      .then(data => setArticles(data.articles))
      .catch(error => {
        if (error.name !== "AbortError") setHasError(true);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [searchQuery]);

  const openEditor = (article: Article) => {
    if (!canManageArticle(article, viewerId)) return;
    setEditingArticle(article);
    setIsCreating(false);
    setActiveView("editor");
  };

  const createArticle = () => {
    setEditingArticle(null);
    setIsCreating(true);
    setActiveView("editor");
  };

  const backToArticles = () => {
    setActiveView("articles");
    setEditingArticle(null);
    setIsCreating(false);
  };

  const refreshArticles = async () => {
    const data = await loadArticles(searchQuery);
    setArticles(data.articles);
    return data.articles;
  };

  const saveArticle = async (fields: ArticleFields) => {
    setIsSaving(true);
    try {
      if (isCreating) {
        const result = await requestJson<{ article: Article }>(
          "/api/articles",
          {
            method: "POST",
            body: JSON.stringify(fields),
          }
        );
        setEditingArticle(result.article);
        setIsCreating(false);
        await refreshArticles();
        toast.success("Rascunho salvo", {
          description: "O artigo foi persistido no banco de dados.",
        });
      } else if (editingArticle) {
        const result = await requestJson<{ success: true; article: Article }>(
          `/api/articles/${encodeURIComponent(editingArticle.id)}`,
          {
            method: "PUT",
            body: JSON.stringify(fields),
          }
        );
        setEditingArticle(result.article);
        await refreshArticles();
        toast.success("Artigo atualizado", {
          description: "A alteração foi persistida no banco de dados.",
        });
      }
    } catch (error) {
      toast.error("Não foi possível salvar o artigo", {
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (article: Article) => {
    if (!canManageArticle(article, viewerId)) return;
    setArticleToDelete(article);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    const deletedId = articleToDelete.id;
    setIsSaving(true);
    try {
      await requestJson<{ success: true }>(
        `/api/articles/${encodeURIComponent(deletedId)}`,
        { method: "DELETE" }
      );
      await refreshArticles();
      setArticleToDelete(null);

      if (editingArticle?.id === deletedId) {
        setEditingArticle(null);
        setIsCreating(false);
        setActiveView("articles");
      }

      toast.success("Artigo removido", {
        description: "A remoção foi aplicada no banco de dados.",
      });
    } catch (error) {
      toast.error("Não foi possível remover o artigo", {
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-vh-100 bg-body-tertiary">
      <Topbar activeView={activeView} onNavigate={setActiveView} />

      {activeView === "overview" && (
        <DashboardView
          articles={articles}
          viewerId={viewerId}
          onEdit={openEditor}
          onDelete={requestDelete}
          onNew={createArticle}
          onNavigate={setActiveView}
          isLoading={isLoading}
          error={hasError}
        />
      )}

      {activeView === "articles" && (
        <ArticlesView
          articles={articles}
          viewerId={viewerId}
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onEdit={openEditor}
          onDelete={requestDelete}
          onNew={createArticle}
          isLoading={isLoading}
          error={hasError}
        />
      )}

      {activeView === "editor" && (
        <ArticleEditor
          article={isCreating ? null : editingArticle}
          authorName={authorName}
          onBack={backToArticles}
          onSave={saveArticle}
          onDelete={requestDelete}
        />
      )}

      {isSaving && (
        <div className="position-fixed bottom-0 end-0 p-3" aria-live="polite">
          <div className="alert alert-light border shadow-sm mb-0">
            Salvando artigo...
          </div>
        </div>
      )}

      {articleToDelete && (
        <DeleteModal
          article={articleToDelete}
          onCancel={() => setArticleToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
