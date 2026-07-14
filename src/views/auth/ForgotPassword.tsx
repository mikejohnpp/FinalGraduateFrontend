import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import AuthFooter from "@/components/auth/AuthFooter";
import { PATH_CONSTRAINT } from "@/plugins/routers";
import { useForgotPassword } from "@/hooks/useUser";

type Step = "email" | "otp" | "reset";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { sendOtp, verifyOtp, resetPassword, loading, error } = useForgotPassword();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    const ok = await sendOtp(email);
    if (ok) setStep("otp");
  };

  const handleVerifyOtp = async () => {
    const ok = await verifyOtp(email, otp);
    if (ok) setStep("reset");
  };

  const handleResetPassword = async () => {
    const ok = await resetPassword(email, otp, newPassword, confirmPassword);
    if (ok) navigate(`/${PATH_CONSTRAINT.LOGIN}`);
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Main content — 2-column layout */}
      <div className="grid flex-1 lg:grid-cols-2">
        {/* Left column — Brand (hidden on mobile) */}
        <div className="hidden items-center justify-center bg-card/50 lg:flex">
          <div className="flex flex-col items-center gap-6 px-8">
            <div className="flex size-48 items-center justify-center rounded-full bg-primary">
              <span className="text-7xl font-bold text-primary-foreground">f</span>
            </div>
            <p className="text-lg text-muted-foreground">Kết nối cộng đồng, chia sẻ khoảnh khắc.</p>
          </div>
        </div>

        {/* Right column — Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-10 flex flex-col gap-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                Quên mật khẩu
              </h1>
              <h2 className="text-xl font-bold text-foreground lg:text-2xl">
                {step === "email" && "Nhập email của bạn."}
                {step === "otp" && "Nhập mã xác nhận."}
                {step === "reset" && "Đặt lại mật khẩu."}
              </h2>
            </div>

            {/* Bước 1: Nhập email */}
            {step === "email" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fp-email">Email</Label>
                  <Input
                    id="fp-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendOtp();
                    }}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Chúng tôi sẽ gửi mã xác nhận (OTP) đến email này.
                  </p>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  className="w-full rounded-full"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  Gửi mã xác nhận
                </Button>
              </div>
            )}

            {/* Bước 2: Nhập OTP */}
            {step === "otp" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fp-otp">Mã OTP</Label>
                  <Input
                    id="fp-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Nhập mã 6 chữ số"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerifyOtp();
                    }}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Mã đã được gửi tới <span className="font-medium">{email}</span>.
                  </p>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  className="w-full rounded-full"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  Xác nhận
                </Button>

                <Button
                  variant="link"
                  className="h-auto p-0 text-sm text-primary"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Gửi lại mã
                </Button>
              </div>
            )}

            {/* Bước 3: Đặt lại mật khẩu */}
            {step === "reset" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fp-new-password">Mật khẩu mới</Label>
                  <Input
                    id="fp-new-password"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="fp-confirm-password">Xác nhận mật khẩu</Label>
                  <Input
                    id="fp-confirm-password"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleResetPassword();
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mật khẩu tối thiểu 8 ký tự, ít nhất một chữ cái và một số.
                  </p>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  className="w-full rounded-full"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  Đặt lại mật khẩu
                </Button>
              </div>
            )}

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Nhớ mật khẩu?{" "}
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

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}
