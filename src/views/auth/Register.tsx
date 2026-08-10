import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthFooter from "@/components/auth/AuthFooter";
import { PATH_CONSTRAINT } from "@/plugins/routers";
import type { RegisterFormData } from "@/types/interfaces/auth/RegisterFormData";
import { RegisterForm } from "./partials/RegisterForm";

export default function Register() {
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="hidden items-center justify-center bg-card/50 lg:flex">
          <div className="flex flex-col items-center gap-6 px-8">
            <div className="flex size-48 items-center justify-center rounded-full bg-primary">
              <span className="text-7xl font-bold text-primary-foreground">f</span>
            </div>
            <p className="text-lg text-muted-foreground">Kết nối cộng đồng, chia sẻ khoảnh khắc.</p>
          </div>
        </div>

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
              <RegisterForm
                models={registerFormData}
                setModels={(models) => setRegisterFormData({ ...models })}
              />
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
