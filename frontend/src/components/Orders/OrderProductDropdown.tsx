"use client";

import {
    ShoppingCart,
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderProductDropdownProps {
    order: any;
    isOpen: boolean;
    onToggle: () => void;
}

export function OrderProductDropdown({ order, isOpen, onToggle }: OrderProductDropdownProps) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold text-xs ring-1",
                    isOpen
                        ? "bg-blue-600 text-white ring-blue-400 shadow-lg shadow-blue-100"
                        : "bg-slate-50 text-slate-600 ring-slate-100 hover:bg-white hover:ring-blue-100"
                )}
            >
                <ShoppingCart size={14} className={isOpen ? "text-blue-200" : "text-blue-500"} />
                {order.products.length} {order.products.length === 1 ? "Item" : "Items"}
                <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
        </div>
    );
}
