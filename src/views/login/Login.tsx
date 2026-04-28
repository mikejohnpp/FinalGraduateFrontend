

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { login } from "@/stores/userSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const userStore = useSelector(
        (state: RootState) => state.user,
    );
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        if (userStore.loginSuccess === true) {
            navigate("/");
        } else {
            navigate("/login");
        }
    }, [userStore.loginSuccess]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-neutral-900 dark:to-neutral-800">
            <form
                className="w-full max-w-sm rounded-xl bg-white/90 dark:bg-neutral-900/90 shadow-xl p-8 space-y-6 border border-slate-200 dark:border-neutral-800"
                autoComplete="off"
            >
                <h2 className="text-2xl font-bold text-center mb-2">Đăng nhập</h2>
                <div className="space-y-2">
                    <Input
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />
                    <Input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button onClick={() => {
                    dispatch(login({ username: username, passwd: password }))
                }} type="button" className="w-full mt-2">
                    Đăng nhập
                </Button>
                <div className="text-xs text-center text-muted-foreground mt-2">
                    Demo: Mật khẩu là <span className="font-semibold">password</span>
                </div>
            </form>
        </div>
    );
}