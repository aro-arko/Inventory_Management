"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Package2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerUser } from "@/services/AuthService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        try {
            const res = await registerUser(data);
            if (res.success) {
                toast.success(res.message || "Registration successful! Please login.");
                router.push("/login");
            } else {
                toast.error(res.message || "Registration failed");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred during registration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 hidden lg:block">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px]" />
            </div>

            <div className="w-full max-w-250 flex rounded-2xl overflow-hidden shadow-lg bg-white relative z-10 border border-[#E5E7EB]">
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-12 text-white flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-2xl font-bold mb-8">
                            <Package2 className="w-8 h-8" />
                            <span>EliteInventory</span>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight mb-4">
                            Start your inventory journey today.
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Join 500+ global enterprises managing their stock with precision and intelligence.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xl">
                                ✓
                            </div>
                            <p className="text-sm font-medium">Quick and easy setup in under 2 minutes.</p>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8 text-[#2563EB] font-bold text-xl">
                        <Package2 className="w-6 h-6" />
                        <span>EliteInventory</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
                            Create an account
                        </h1>
                        <p className="text-[#475569]">
                            Enter your details to start managing your inventory.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[#0F172A] font-semibold">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                className={cn(
                                    "h-11 border-[#E5E7EB] focus:border-[#2563EB] focus:ring-[#2563EB]",
                                    errors.name && "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]"
                                )}
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-xs text-[#DC2626] mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[#0F172A] font-semibold">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className={cn(
                                    "h-11 border-[#E5E7EB] focus:border-[#2563EB] focus:ring-[#2563EB]",
                                    errors.email && "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]"
                                )}
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-xs text-[#DC2626] mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[#0F172A] font-semibold">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={cn(
                                        "h-11 pr-10 border-[#E5E7EB] focus:border-[#2563EB] focus:ring-[#2563EB]",
                                        errors.password && "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]"
                                    )}
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-[#DC2626] mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] transition-all font-semibold disabled:bg-blue-300"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#475569]">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-[#2563EB] hover:underline">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

