import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import AuthFooter from "@/components/auth/AuthFooter";
import { PATH_CONSTRAINT } from "@/plugins/routers";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      // TODO: await loginService({ email, password })
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(PATH_CONSTRAINT.HOME);
    } catch {
      setError("Email hoặc mật khẩu không đúng");
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
                Chào mừng trở lại.
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Mật khẩu</Label>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-primary"
                  >
                    Quên mật khẩu?
                  </Button>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                className="w-full rounded-full"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading && <Spinner data-icon="inline-start" />}
                Đăng nhập
              </Button>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-primary"
                    onClick={() =>
                      navigate(`/${PATH_CONSTRAINT.REGISTER}`)
                    }
                  >
                    Đăng ký
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
