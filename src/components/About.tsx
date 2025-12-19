const About = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-[980px] flex-col gap-6 px-6 py-10">
      <div className="rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          关于
        </p>
        <h1 className="font-display mt-3 text-3xl font-semibold text-slate-900">
          这是一个纯前端的美学二维码工作台
        </h1>
        <p className="mt-4 text-sm text-slate-600">
          所有二维码均通过 Canvas 渲染，无需后端服务，适合用于品牌化链接、活动落地页或线下物料。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "可编程模块",
            detail: "点阵、圆角、液态等形状直接在画布中绘制。"
          },
          {
            title: "色彩与渐变",
            detail: "支持前景渐变和独立定位图配色，保持识别度。"
          },
          {
            title: "中心 Logo",
            detail: "上传图像后自动建议高纠错等级，提高容错。"
          }
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm"
          >
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          友链
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            {
              name: "shen.chat 导航站",
              url: "https://shen.chat"
            },
            {
              name: "shen806.icu 作者个人介绍",
              url: "https://shen806.icu"
            },
            {
              name: "shentv.dpdns.org 个人信息存储工具",
              url: "https://shentv.dpdns.org"
            },
            {
              name: "shen806.dpdns.org 作者个人日常网站",
              url: "https://shen806.dpdns.org"
            }
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/70 p-6 text-sm text-slate-600 shadow-sm">
        提示：二维码的可扫描性与对比度和留白密切相关，建议保持足够的边距。
      </div>
    </div>
  );
};

export default About;
