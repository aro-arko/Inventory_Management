"use client";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionIcon?: ReactNode;
    onAction?: () => void;
    className?: string;
}

export function PageHeader({
    title,
    description,
    actionLabel,
    actionIcon,
    onAction,
    className
}: PageHeaderProps) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
                <p className="text-slate-500">{description}</p>
            </div>
            {actionLabel && (
                <Button
                    onClick={onAction}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 h-11 px-6 rounded-xl shadow-lg shadow-blue-200"
                >
                    {actionIcon} {actionLabel}
                </Button>
            )}
        </div>
    );
}
