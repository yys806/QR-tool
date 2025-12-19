import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";

marked.setOptions({ breaks: true });

type DocEntry = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  body: string;
  html: string;
};

const rawDocs = import.meta.glob("../content/docs/*.md", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>;

const parseFrontmatter = (raw: string) => {
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]*([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }

  const meta: Record<string, string> = {};
  match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(":");
      if (!key || rest.length === 0) {
        return;
      }
      meta[key.trim()] = rest.join(":").trim();
    });

  return { meta, body: match[2].trim() };
};

const parseDateValue = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const parseDoc = (path: string, raw: string): DocEntry => {
  const { meta, body } = parseFrontmatter(raw);
  const slug =
    path
      .split(/[\\/]/)
      .pop()
      ?.replace(/\.md$/, "") ?? "doc";
  const tags = meta.tags
    ? meta.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return {
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    tags,
    body,
    html: marked.parse(body) as string
  };
};

const docs = Object.entries(rawDocs)
  .map(([path, raw]) => parseDoc(path, raw))
  .sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));

type TimeFilter = "all" | "7d" | "30d" | "180d" | "365d";
type DocGroup = {
  key: string;
  yearLabel: string;
  monthLabel: string;
  items: DocEntry[];
};

const Docs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const now = Date.now();
    const timeRanges: Record<TimeFilter, number> = {
      all: 0,
      "7d": 7,
      "30d": 30,
      "180d": 180,
      "365d": 365
    };
    const activeDays = timeRanges[timeFilter];

    return docs.filter((doc) => {
      if (activeDays) {
        const timestamp = parseDateValue(doc.date);
        if (!timestamp || now - timestamp > activeDays * 86400000) {
          return false;
        }
      }

      if (!keyword) {
        return true;
      }

      const haystack = [doc.title, doc.tags.join(" ")].join(" ").toLowerCase();

      return haystack.includes(keyword);
    });
  }, [searchTerm, timeFilter]);

  const groupedDocs = useMemo(() => {
    const groups: DocGroup[] = [];
    let currentGroup: DocGroup | null = null;

    filteredDocs.forEach((doc) => {
      const timestamp = parseDateValue(doc.date);
      let yearLabel = "未标注时间";
      let monthLabel = "未标注月份";
      let key = "unknown";

      if (timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        yearLabel = `${year}年`;
        monthLabel = `${year}年${String(month).padStart(2, "0")}月`;
        key = `${year}-${month}`;
      }

      if (!currentGroup || currentGroup.key !== key) {
        currentGroup = { key, yearLabel, monthLabel, items: [] };
        groups.push(currentGroup);
      }

      currentGroup.items.push(doc);
    });

    return groups;
  }, [filteredDocs]);

  useEffect(() => {
    if (!activeSlug) {
      return;
    }
    const stillVisible = filteredDocs.some((doc) => doc.slug === activeSlug);
    if (!stillVisible) {
      setActiveSlug(null);
    }
  }, [activeSlug, filteredDocs]);

  const activeDoc = filteredDocs.find((doc) => doc.slug === activeSlug) ?? null;

  return (
    <div className="mx-auto flex min-h-screen max-w-full flex-col gap-6 px-6 py-10 lg:max-w-[67vw]">
      <div className="rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          文档
        </p>
        <h1 className="font-display mt-3 text-3xl font-semibold text-slate-900">
          使用指南与最佳实践
        </h1>
        <p className="mt-4 text-sm text-slate-600">
          点击标题查看正文，通过标签快速筛选你需要的内容。
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="搜索标题 / 标签 / 正文"
          className="h-10 w-full max-w-[260px] rounded-full border border-slate-200 bg-white/80 px-4 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"
        />
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
            时间
          </span>
          <select
            value={timeFilter}
            onChange={(event) => setTimeFilter(event.target.value as TimeFilter)}
            className="h-10 rounded-full border border-slate-200 bg-white/80 px-3 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
          >
            <option value="all">全部</option>
            <option value="7d">近 7 天</option>
            <option value="30d">近 30 天</option>
            <option value="180d">近半年</option>
            <option value="365d">近一年</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            文档目录
          </h2>
          <div className="mt-4 space-y-4">
            {filteredDocs.length === 0 ? (
              <p className="text-sm text-slate-500">暂无匹配文档。</p>
            ) : (
              groupedDocs.map((group, groupIndex) => {
                const isFirstOfYear =
                  groupIndex === 0 ||
                  groupedDocs[groupIndex - 1]?.yearLabel !== group.yearLabel;

                return (
                  <div key={`${group.key}-${groupIndex}`} className="space-y-3">
                    {isFirstOfYear && (
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {group.yearLabel}
                      </div>
                    )}
                    <div className="relative">
                      <div className="border-t border-dashed border-slate-200" />
                      <span className="absolute -top-3 left-3 rounded-full border border-white/70 bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                        {group.monthLabel}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.items.map((doc) => (
                        <button
                          key={doc.slug}
                          type="button"
                          onClick={() => setActiveSlug(doc.slug)}
                          className={`w-full rounded-xl border-b border-dashed border-slate-200 px-3 py-3 text-left text-sm font-semibold transition last:border-b-0 ${
                            activeSlug === doc.slug
                              ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                              : "bg-white/80 text-slate-700 hover:bg-white"
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <span>{doc.title}</span>
                            <span className="text-xs font-normal text-slate-500">
                              {doc.date || "未填写"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        <section className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm">
          {activeDoc ? (
            <>
              <header className="flex flex-col gap-2">
                <h2 className="font-display text-2xl font-semibold text-slate-900">
                  {activeDoc.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>时间：{activeDoc.date || "未填写"}</span>
                  <span>标签：</span>
                  {activeDoc.tags.length ? (
                    activeDoc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span>无</span>
                  )}
                </div>
              </header>

              <div
                className="markdown mt-4 text-sm text-slate-700"
                dangerouslySetInnerHTML={{ __html: activeDoc.html }}
              />
            </>
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-slate-500">
              请选择左侧文档标题查看正文。
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Docs;
