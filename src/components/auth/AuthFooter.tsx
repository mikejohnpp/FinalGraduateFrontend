const footerLinks = [
  "Giới thiệu",
  "Trung tâm trợ giúp",
  "Điều khoản dịch vụ",
  "Chính sách quyền riêng tư",
  "Cookie",
  "Khả năng tiếp cận",
  "Quảng cáo",
  "Tuyển dụng",
  "Nhà phát triển",
  "Cài đặt",
];

export default function AuthFooter() {
  return (
    <nav className="w-full border-t border-border px-6 py-4">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {footerLinks.map((link) => (
          <span
            key={link}
            className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {link}
          </span>
        ))}
        <span className="text-xs text-muted-foreground">
          © 2026 Tiệm Cũ
        </span>
      </div>
    </nav>
  );
}
