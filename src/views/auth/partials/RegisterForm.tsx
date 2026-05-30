import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUserRegister } from "@/hooks/useUser";
import type { RegisterFormData } from "@/types/interfaces/auth/RegisterFormData";
import { getParsedErrorValue } from "@/utils/errorHelper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH_CONSTRAINT } from "@/plugins/routers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface RegisterFormProps {
  models: RegisterFormData;
  setModels: (models: RegisterFormData) => void;
}
export function RegisterForm({ models, setModels }: RegisterFormProps) {
  const { register, loading, error } = useUserRegister();
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleRegister = async () => {
    const success = await register(models);
    if (success) {
      setShowSuccessDialog(true);
      let count = 5;
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          navigate(PATH_CONSTRAINT.LOGIN);
        }
      }, 1000);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <Field data-invalid={getParsedErrorValue(error, "username") ? true : false}>
          <FieldLabel htmlFor="register-username">Tên đầy đủ</FieldLabel>

          <Input
            id="register-username"
            type="text"
            placeholder="Tên đầy đủ của bạn"
            value={models.username}
            onChange={(e) => setModels({ ...models, username: e.target.value })}
            autoFocus
            aria-invalid={getParsedErrorValue(error, "username") ? true : false}
          />
          <FieldDescription>{getParsedErrorValue(error, "username")}</FieldDescription>
        </Field>
      </div>
      <div className="flex flex-col gap-2">
        <Field data-invalid={getParsedErrorValue(error, "email") ? true : false}>
          <FieldLabel htmlFor="register-email">Email</FieldLabel>

          <Input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            value={models.email}
            onChange={(e) => setModels({ ...models, email: e.target.value })}
            autoFocus
            aria-invalid={getParsedErrorValue(error, "email") ? true : false}
          />
          <FieldDescription>{getParsedErrorValue(error, "email")}</FieldDescription>
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <Field data-invalid={getParsedErrorValue(error, "password") ? true : false}>
          <FieldLabel htmlFor="register-password">Mật khẩu</FieldLabel>
          <Input
            id="register-password"
            type="password"
            placeholder="Ít nhất 6 ký tự"
            value={models.password}
            onChange={(e) => setModels({ ...models, password: e.target.value })}
            aria-invalid={getParsedErrorValue(error, "password") ? true : false}
          />
          <FieldDescription>{getParsedErrorValue(error, "password")}</FieldDescription>
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <Field data-invalid={getParsedErrorValue(error, "confirmPassword") ? true : false}>
          <FieldLabel htmlFor="register-confirm-password">Xác nhận mật khẩu</FieldLabel>
          <Input
            id="register-confirm-password"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={models.confirmPassword}
            onChange={(e) => setModels({ ...models, confirmPassword: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRegister();
            }}
            aria-invalid={getParsedErrorValue(error, "confirmPassword") ? true : false}
          />
          <FieldDescription>{getParsedErrorValue(error, "confirmPassword")}</FieldDescription>
        </Field>
      </div>

      {error && (
        <p className="text-sm text-destructive">{typeof error === "string" ? error : ""}</p>
      )}

      <Button className="w-full rounded-full" onClick={handleRegister} disabled={loading}>
        {loading && <Spinner data-icon="inline-start" />}
        Tạo tài khoản
      </Button>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đăng ký thành công!</DialogTitle>
            <DialogDescription>
              Vui lòng kiểm tra email của bạn để xác nhận tài khoản.
              <br />
              Tự động chuyển đến trang đăng nhập sau {countdown} giây...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
