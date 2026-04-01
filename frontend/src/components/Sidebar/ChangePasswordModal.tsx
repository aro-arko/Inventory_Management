"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    X,
    Lock,
    ShieldCheck,
    Loader2,
    Eye,
    EyeOff,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { changePassword } from "@/services/AuthService";
import { toast } from "sonner";

const changePasswordSchema = z.object({
    oldPassword: z.string().min(8, "Old password must be at least 8 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export function ChangePasswordModal({ isOpen, onClose, user }: ChangePasswordModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormValues) => {
        if (user?.email === "tom@example.com") {
            toast.error("Demo account password cannot be changed.", {
                description: "To protect the demo experience, this account is read-only for security settings.",
                icon: <Lock size={16} className="text-red-500" />
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });

            if (res.success) {
                toast.success("Password updated successfully!");
                reset();
                onClose();
            } else {
                toast.error(res.message || "Failed to update password");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 leading-tight">Security Settings</h3>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Update Password</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-300 hover:text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                                Current Password
                            </Label>
                            <div className="relative group">
                                <Input
                                    type={showOld ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={cn(
                                        "h-12 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-200 transition-all px-5 pr-12",
                                        errors.oldPassword && "border-red-100 focus:border-red-200"
                                    )}
                                    {...register("oldPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOld(!showOld)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.oldPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.oldPassword.message}</p>}
                        </div>

                        <div className="h-px bg-slate-100 my-2" />

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                                New Password
                            </Label>
                            <div className="relative group">
                                <Input
                                    type={showNew ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className={cn(
                                        "h-12 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-200 transition-all px-5 pr-12",
                                        errors.newPassword && "border-red-100 focus:border-red-200"
                                    )}
                                    {...register("newPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.newPassword.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                                Confirm New Password
                            </Label>
                            <div className="relative group">
                                <Input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className={cn(
                                        "h-12 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-200 transition-all px-5 pr-12",
                                        errors.confirmPassword && "border-red-100 focus:border-red-200"
                                    )}
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Update Password <ShieldCheck size={18} />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-2">
                    <CheckCircle2 size={14} className="text-slate-400" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Security Standard</p>
                </div>
            </div>
        </div>
    );
}
