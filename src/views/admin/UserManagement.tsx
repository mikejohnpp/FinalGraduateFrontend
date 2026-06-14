import { useState, useEffect } from "react";
import adminService, { type UserAdminDTO } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<UserAdminDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdminDTO | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    nickName: "",
    roleId: 1, // Default to USER role (ID 1)
    phoneNumber: "",
    gender: "",
    isActive: true,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(page, 10, search);
      if (res?.data) {
        setUsers(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleOpenModal = (user: UserAdminDTO | null = null) => {
    setSelectedUser(user);
    if (user) {
      setFormData({
        userName: user.userName,
        email: user.email,
        password: "", // Leave blank for edit
        nickName: user.nickName || "",
        roleId: user.roleName === "ROLE_ADMIN" ? 2 : 1,
        phoneNumber: user.phoneNumber?.toString() || "",
        gender: user.gender || "",
        isActive: user.isActive,
      });
    } else {
      setFormData({
        userName: "",
        email: "",
        password: "",
        nickName: "",
        roleId: 1,
        phoneNumber: "",
        gender: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser) {
        // Update
        await adminService.updateUser(selectedUser.id, {
          userName: formData.userName,
          email: formData.email,
          nickName: formData.nickName,
          roleId: formData.roleId,
          phoneNumber: formData.phoneNumber ? Number(formData.phoneNumber) : null,
          gender: formData.gender,
          isActive: formData.isActive,
        });
        toast.success("Cập nhật thành công");
      } else {
        // Create
        if (!formData.password) {
          toast.error("Vui lòng nhập mật khẩu");
          return;
        }
        await adminService.createUser({
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          nickName: formData.nickName,
          roleId: formData.roleId,
        });
        toast.success("Tạo người dùng thành công");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const confirmDelete = (user: UserAdminDTO) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await adminService.deleteUser(selectedUser.id);
      toast.success("Xóa người dùng thành công");
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error("Không thể xóa người dùng");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Người dùng</h2>
        <Button onClick={() => handleOpenModal(null)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm người dùng
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm user name hoặc email..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 transition-colors">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                ID
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                User Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Email
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Role
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Trạng thái
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-24 text-center text-muted-foreground">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">{user.id}</td>
                  <td className="p-4 align-middle font-medium">{user.userName}</td>
                  <td className="p-4 align-middle">{user.email}</td>
                  <td className="p-4 align-middle">{user.roleName}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.isActive ? "bg-emerald-100 text-emerald-800" : "bg-destructive/20 text-destructive"}`}
                    >
                      {user.isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>
                  <td className="p-4 text-right align-middle">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => confirmDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Trước
        </Button>
        <div className="text-sm text-muted-foreground">
          Trang {page + 1} / {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
        >
          Sau
        </Button>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">User Name</label>
              <Input
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {!selectedUser && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Mật khẩu</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Vai trò</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
              >
                <option value={2}>ADMIN (Quản trị viên)</option>
                <option value={1}>USER (Người dùng)</option>
              </select>
            </div>
            {selectedUser && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Trạng thái</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.isActive ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.value === "true" })
                  }
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Khóa (Soft Delete)</option>
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveUser}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc chắn muốn xóa (khóa) người dùng <strong>{selectedUser?.userName}</strong>{" "}
            không? Người dùng này sẽ không thể đăng nhập vào hệ thống.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Đồng ý xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
