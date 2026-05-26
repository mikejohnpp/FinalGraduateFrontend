import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthFooter from "@/components/auth/AuthFooter";
import { PATH_CONSTRAINT } from "@/plugins/routers";
import { Spinner } from "@/components/ui/spinner";
import { useUserActivate } from "@/hooks/useUser";

export default function ActivateAccount() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { status, errorMessage } = useUserActivate(code);

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <Spinner className="size-8" />
              <h2 className="text-2xl font-bold">Đang kích hoạt tài khoản...</h2>
            </div>
          )}
          
          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600">Kích hoạt thành công!</h2>
              <p className="text-muted-foreground">Tài khoản của bạn đã được kích hoạt. Bây giờ bạn có thể đăng nhập.</p>
              <Button onClick={() => navigate(`/${PATH_CONSTRAINT.LOGIN}`)} className="mt-4">
                Đi đến trang đăng nhập
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-destructive">Kích hoạt thất bại</h2>
              <p className="text-muted-foreground">{errorMessage}</p>
              <Button variant="outline" onClick={() => navigate(`/${PATH_CONSTRAINT.LOGIN}`)} className="mt-4">
                Quay lại trang đăng nhập
              </Button>
            </div>
          )}
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}
