"use client";

import {
    LogOut,
    Package2,
    Key,
    ChevronUp,
    ChevronDown,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChangePasswordModal } from "./ChangePasswordModal";

interface NavItem {
    name: string;
    href: string;
    icon: any;
}

interface SidebarContentProps {
    navItems: NavItem[];
    isSidebarOpen: boolean;
    user: any;
    handleLogout: () => void;
    isMobile?: boolean;
    onClose?: () => void;
}

export function SidebarContent({
    navItems,
    isSidebarOpen,
    user,
    handleLogout,
    isMobile = false,
    onClose
}: SidebarContentProps) {
    const pathname = usePathname();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    return (
        <div className="h-full flex flex-col relative">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <Package2 size={20} />
                    </div>
                    {(isSidebarOpen || isMobile) && (
                        <span className="font-bold text-xl text-slate-800 tracking-tight text-center">EliteInv</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                !isSidebarOpen && !isMobile && "justify-center px-0"
                            )}
                        >
                            <item.icon className={cn(
                                "shrink-0",
                                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                            )} size={22} />
                            {(isSidebarOpen || isMobile) && (
                                <span className="font-medium text-[15px]">{item.name}</span>
                            )}
                            {isActive && (isSidebarOpen || isMobile) && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User section */}
            <div className="p-4 border-t border-slate-100 relative">
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (isSidebarOpen || isMobile) && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in slide-in-from-bottom-2 duration-200 z-50">
                        <button
                            onClick={() => {
                                setIsUserMenuOpen(false);
                                setIsChangePasswordOpen(true);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all text-sm font-semibold"
                        >
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <Key size={16} />
                            </div>
                            Change Password
                        </button>
                        <button
                            onClick={() => {
                                setIsUserMenuOpen(false);
                                handleLogout();
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-semibold"
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                                <LogOut size={16} />
                            </div>
                            Sign Out
                        </button>
                    </div>
                )}

                {(isSidebarOpen || isMobile) ? (
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className={cn(
                            "w-full bg-slate-50 hover:bg-slate-100 rounded-2xl p-3 transition-all text-left group border-2 border-transparent",
                            isUserMenuOpen && "border-blue-100 bg-white shadow-sm"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm shrink-0">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                    {user?.name || "User"}
                                </p>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck size={10} className="text-blue-500" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                                        {user?.role || "Manager"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                                {isUserMenuOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                            </div>
                        </div>
                    </button>
                ) : (
                    <button 
                        onClick={handleLogout}
                        className="w-full flex justify-center py-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={22} />
                    </button>
                )}
            </div>

            <ChangePasswordModal 
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
                user={user}
            />
        </div>
    );
}
