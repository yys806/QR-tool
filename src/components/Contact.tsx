const contactChannels = [
  {
    title: "邮箱",
    value: "yaoshen806@qq.com",
    hint: "建议附上用途、尺寸与色彩偏好",
    href: "yaoshen806@qq.com"
  },
  {
    title: "微信",
    value: "yys08060910",
    hint: "添加请备注：二维码工具",
    href: ""
  },
  {
    title: "其他文章",
    value: "blog",
    hint: "提交使用反馈与新功能想法",
    href: "https://yys806.github.io/"
  }
];

const serviceInfo = [
  {
    title: "服务时间",
    detail: "工作日 09:00 - 18:00"
  },
  {
    title: "响应时效",
    detail: "一般在 24 小时内回复"
  },
  {
    title: "合作方向",
    detail: "品牌活动、展会物料、移动端落地页"
  }
];

const Contact = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-full flex-col gap-6 px-6 py-10 lg:max-w-[75vw]">
      <div className="rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          联系我们
        </p>
        <h1 className="font-display mt-3 text-3xl font-semibold text-slate-900">
          有想法就告诉我们，一起把二维码做得更好
        </h1>
        <p className="mt-4 text-sm text-slate-600">
          无论是功能建议、合作需求还是设计反馈，都欢迎留言。我们会尽快回复你，并提供可执行的解决方案。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {contactChannels.map((channel) => {
          const content = (
            <>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                {channel.title}
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {channel.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{channel.hint}</p>
            </>
          );

          return channel.href ? (
            <a
              key={channel.title}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200"
            >
              {content}
            </a>
          ) : (
            <div
              key={channel.title}
              className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm"
            >
              {content}
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {serviceInfo.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm"
          >
            <h3 className="font-display text-base font-semibold text-slate-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/70 p-6 text-sm text-slate-600 shadow-sm">
        提示：为了更快定位问题，请在反馈中附上二维码内容、颜色值、所用设备与截图。
      </div>
    </div>
  );
};

export default Contact;
