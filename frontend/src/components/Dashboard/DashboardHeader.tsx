"use client";

import { 
    Search,
    Bell,
    User
} from "lucide-react";

interface DashboardHeaderProps {
    user: any;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 hidden lg:flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4 text-slate-400">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search everything..."
                        className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-100 w-64 text-sm transition-all text-slate-600 cursor-not-allowed"
                        disabled
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                <div className="h-4 w-[1px] bg-slate-200 mx-2" />
                <div className="flex items-center gap-2 pl-2">
                     <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <User size={18} />
                     </div>
                     <span className="text-sm font-semibold text-slate-700">{user?.role || "Admin"}</span>
                </div>
            </div>
        </header>
    );
}
