"use client";

import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingCart,
    AlertTriangle,
    ChevronRight,
    Package2,
    X,
    Menu
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarContent } from "./SidebarContent";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Categories", href: "/categories", icon: Tags },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Restock Queue", href: "/restock-queue", icon: AlertTriangle },
];

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    user: any;
    handleLogout: () => void;
}

export function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    user,
    handleLogout
}: SidebarProps) {
    return (
        <>
            {/* Sidebar - Desktop */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-slate-200 hidden lg:block",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="h-full relative">
                    <SidebarContent 
                        navItems={navItems}
                        isSidebarOpen={isSidebarOpen}
                        user={user}
                        handleLogout={handleLogout}
                    />

                    {/* Collapse Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm"
                    >
                        {isSidebarOpen ? <ChevronRight size={14} className="rotate-180" /> : <ChevronRight size={14} />}
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Trigger) */}
            <header className="lg:hidden h-16 bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-40 px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                        <Package2 size={18} />
                    </div>
                    <span className="font-bold text-lg text-slate-800">EliteInv</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <aside
                        className="w-72 h-full bg-white animate-in slide-in-from-left duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SidebarContent 
                            navItems={navItems}
                            isSidebarOpen={true}
                            user={user}
                            handleLogout={handleLogout}
                            isMobile={true}
                            onClose={() => setIsMobileMenuOpen(false)}
                        />
                    </aside>
                </div>
            )}
        </>
    );
}

export default Sidebar;
