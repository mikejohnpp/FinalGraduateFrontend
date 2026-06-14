import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import adminService, { type GroupAdminDTO } from "@/services/adminService";
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
import { useEffect, useState } from "react";
import type { UserAdminDTO } from "@/services/adminService";

export default function GroupManagement() {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [groups, setGroups] = useState<GroupAdminDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupAdminDTO | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    privacy: "public",
    isActive: true,
    adminId: "",
  });

  const [allUsers, setAllUsers] = useState<UserAdminDTO[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Fetch a large number of users to populate the dropdown
        const res = await adminService.getUsers(0, 1000, "");
        if (res?.data) {
          setAllUsers(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
      }
    };
    fetchAllUsers();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await adminService.getGroups(page, 10, search);
      if (res?.data) {
        setGroups(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      toast.error("Không thể tải danh sách nhóm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [page, search]);

  const handleOpenModal = (group: GroupAdminDTO | null = null) => {
    setSelectedGroup(group);
    if (group) {
      setFormData({
        name: group.name,
        privacy: group.privacy || "public",
        isActive: group.isActive,
        adminId: group.adminId?.toString() || "",
      });
    } else {
      setFormData({
        name: "",
        privacy: "public",
        isActive: true,
        adminId: userId?.toString() || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveGroup = async () => {
    try {
      if (selectedGroup) {
        // Update
        await adminService.updateGroup(selectedGroup.id, {
          name: formData.name,
          privacy: formData.privacy,
          isActive: formData.isActive,
          adminId: formData.adminId ? parseInt(formData.adminId) : null,
        });
        toast.success("Cập nhật nhóm thành công");
      } else {
        // Create
        if (!formData.adminId) {
          toast.error("Vui lòng nhập Admin ID");
          return;
        }
        await adminService.createGroup({
          name: formData.name,
          privacy: formData.privacy,
          adminId: parseInt(formData.adminId),
        });
        toast.success("Tạo nhóm thành công");
      }
      setIsModalOpen(false);
      fetchGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const confirmDelete = (group: GroupAdminDTO) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    try {
      await adminService.deleteGroup(selectedGroup.id);
      toast.success("Xóa nhóm thành công");
      setIsDeleteModalOpen(false);
      fetchGroups();
    } catch (err) {
      toast.error("Không thể xóa nhóm");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Nhóm</h2>
        <Button onClick={() => handleOpenModal(null)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm nhóm
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm tên nhóm..."
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
                Tên Nhóm
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Quyền riêng tư
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Admin
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
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-24 text-center text-muted-foreground">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr
                  key={group.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">{group.id}</td>
                  <td className="p-4 align-middle font-medium">{group.name}</td>
                  <td className="p-4 align-middle capitalize">{group.privacy}</td>
                  <td className="p-4 align-middle">
                    <span className="text-xs text-muted-foreground">ID: {group.adminId}</span>
                    <br />
                    {group.adminName}
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${group.isActive ? "bg-emerald-100 text-emerald-800" : "bg-destructive/20 text-destructive"}`}
                    >
                      {group.isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>
                  <td className="p-4 text-right align-middle">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(group)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => confirmDelete(group)}
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
            <DialogTitle>{selectedGroup ? "Cập nhật nhóm" : "Thêm nhóm mới"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tên nhóm</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Quyền riêng tư</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.privacy}
                onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
              >
                <option value="public">Công khai (Public)</option>
                <option value="private">Riêng tư (Private)</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Người quản trị</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.adminId}
                onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
              >
                <option value="">-- Chọn người quản trị --</option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.userName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            {selectedGroup && (
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
            <Button onClick={handleSaveGroup}>Lưu</Button>
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
            Bạn có chắc chắn muốn xóa (khóa) nhóm <strong>{selectedGroup?.name}</strong> không? Nhóm
            này sẽ không còn hiển thị với người dùng.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              Đồng ý xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
