import { Button } from "@/components/ui/button"
import { increment } from "@/stores/counterSlice";
import type { RootState } from "@/stores/store";
import { logout } from "@/stores/userSlice";
import { generateId } from "@/utils/stringHelper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const counter = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();

    const userStore = useSelector(
        (state: RootState) => state.user,
    );

    const navigate = useNavigate();

    useEffect(() => {
        if (userStore.loginSuccess === true) {
            navigate("/");
        } else {
            navigate("/login");
        }
    }, [userStore.loginSuccess]);
    return (
        <div className="flex min-h-svh flex-col">
            {/* Header user info */}
            <header className="w-full flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-neutral-900/80 border-b border-slate-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                        {userStore.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-base leading-tight">{userStore.username}</span>
                        <span className="text-xs text-muted-foreground">Đã đăng nhập</span>
                    </div>
                </div>
                <Button onClick={() => {
                    dispatch(logout())
                }} variant="outline" size="sm" type="button">Đăng xuất</Button>
            </header>
            {/* Main content */}
            <main className="flex flex-1 flex-col items-center justify-center">
                <Button onClick={() => { dispatch(increment()) }}>
                    Click me {counter} {generateId()}
                </Button>
            </main>
        </div>
    );
}