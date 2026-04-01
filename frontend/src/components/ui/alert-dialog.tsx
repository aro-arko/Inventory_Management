"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AlertDialog = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" 
                onClick={() => onOpenChange(false)} 
            />
            {children}
        </div>
    );
};

const AlertDialogContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "relative w-full max-w-lg border-none bg-white p-8 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 fade-in duration-200",
            className
        )}
        {...props}
    >
        {children}
    </div>
);

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 pt-6", className)} {...props} />
);

const AlertDialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("text-xl font-bold text-slate-800", className)} {...props} />
);

const AlertDialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-sm font-medium text-slate-500", className)} {...props} />
);

const AlertDialogAction = ({ className, onClick, children, ...props }: any) => (
    <Button
        className={cn("h-11 rounded-xl px-8 font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100", className)}
        onClick={onClick}
        {...props}
    >
        {children}
    </Button>
);

const AlertDialogCancel = ({ className, onClick, children, ...props }: any) => (
    <Button
        variant="outline"
        className={cn("h-11 rounded-xl px-8 font-bold border-slate-200 text-slate-600 hover:bg-slate-50 mt-2 sm:mt-0", className)}
        onClick={onClick}
        {...props}
    >
        {children}
    </Button>
);

export {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};
