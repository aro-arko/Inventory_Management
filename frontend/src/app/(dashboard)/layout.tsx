"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/AuthService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user && pathname !== "/login" && pathname !== "/signup") {
            router.push("/login");
        }
    }, [user, isLoading, pathname, router]);

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/login");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user && pathname !== "/login" && pathname !== "/signup") {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar 
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                user={user}
                handleLogout={handleLogout}
            />

            {/* Main Content Area */}
            <main 
                className={cn(
                    "transition-all duration-300 min-h-screen pt-16 lg:pt-0",
                    isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
                )}
            >
                {/* Topbar/Header section in main area */}
                <DashboardHeader user={user} />

                {/* Page Content */}
                <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
