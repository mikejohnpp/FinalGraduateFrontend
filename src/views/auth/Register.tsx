import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import AuthFooter from "@/components/auth/AuthFooter";
import { PATH_CONSTRAINT } from "@/plugins/routers";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null);

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      // TODO: await registerService({ email, password, confirmPassword })
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(`/${PATH_CONSTRAINT.LOGIN}`);
    } catch {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Main content — 2-column layout */}
      <div className="grid flex-1 lg:grid-cols-2">
        {/* Left column — Brand (hidden on mobile) */}
        <div className="hidden items-center justify-center bg-card/50 lg:flex">
          <div className="flex flex-col items-center gap-6 px-8">
            <div className="flex size-48 items-center justify-center rounded-full bg-primary">
              <span className="text-7xl font-bold text-primary-foreground">
                f
              </span>
            </div>
            <p className="text-lg text-muted-foreground">
              Kết nối cộng đồng, chia sẻ khoảnh khắc.
            </p>
          </div>
        </div>

        {/* Right column — Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-10 flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                Đang xảy ra ngay bây giờ
              </h1>
              <h2 className="text-xl font-bold text-foreground lg:text-2xl">
                Tham gia ngay hôm nay.
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="register-password">Mật khẩu</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Ít nhất 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="register-confirm-password">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRegister();
                  }}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                className="w-full rounded-full"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading && <Spinner data-icon="inline-start" />}
                Tạo tài khoản
              </Button>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Đã có tài khoản?{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-primary"
                    onClick={() => navigate(`/${PATH_CONSTRAINT.LOGIN}`)}
                  >
                    Đăng nhập
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}
