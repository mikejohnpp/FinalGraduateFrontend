import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { Users, UsersRound, Settings, ArrowLeft, PieChart, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUser";
import OverlaySpinner from "@/components/OverlaySpinner";

export default function AdminLayout() {
  const profile = useSelector((state: RootState) => state.user.profile);
  const loginSuccess = useSelector((state: RootState) => state.user.loginSuccess);
  
  const { loading: profileLoading } = useUserProfile();

  // Auth Guard: Only users with role "ADMIN" can access
  // Adjust this condition based on your actual role structure
  if (!loginSuccess) {
    return <Navigate to="/login" replace />;
  }

  if (profileLoading || !profile) {
    return <OverlaySpinner show text="Đang xác thực quyền Admin..." />;
  }

  if (profile.role !== "ROLE_ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/20">
        <h1 className="text-3xl font-bold text-destructive">Truy cập bị từ chối</h1>
        <p className="text-muted-foreground">Bạn không có quyền truy cập vào trang quản trị.</p>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r bg-background">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <span className="flex items-center gap-2 font-bold text-primary">
            <Settings className="h-6 w-6" />
            <span className="text-lg">Admin Dashboard</span>
          </span>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? "bg-muted text-primary" : "text-muted-foreground"
                }`
              }
            >
              <Users className="h-4 w-4" />
              Quản lý người dùng
            </NavLink>
            <NavLink
              to="/admin/groups"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? "bg-muted text-primary" : "text-muted-foreground"
                }`
              }
            >
              <UsersRound className="h-4 w-4" />
              Quản lý nhóm
            </NavLink>
            <NavLink
              to="/admin/sentiment"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? "bg-muted text-primary" : "text-muted-foreground"
                }`
              }
            >
              <PieChart className="h-4 w-4" />
              Thống kê cảm xúc
            </NavLink>
            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? "bg-muted text-primary" : "text-muted-foreground"
                }`
              }
            >
              <FileBarChart className="h-4 w-4" />
              Báo cáo hệ thống
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col pl-64">
        <div className="flex h-14 items-center border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <h1 className="text-lg font-semibold md:text-2xl">Bảng điều khiển</h1>
        </div>
        <div className="flex-1 p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
