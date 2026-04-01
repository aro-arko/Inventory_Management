"use client";

import { 
    Plus, 
    Edit2,
    Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: any;
    register: any;
    errors: any;
    isSubmitting: boolean;
    editingCategory: any;
}

export function CategoryFormModal({
    isOpen,
    onClose,
    onSubmit,
    register,
    errors,
    isSubmitting,
    editingCategory
}: CategoryFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200" 
                onClick={() => !isSubmitting && onClose()} 
            />
            <Card className="relative w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        {editingCategory ? (
                            <>
                                <Edit2 size={20} className="text-blue-600" /> Update Category
                            </>
                        ) : (
                            <>
                                <Plus size={20} className="text-blue-600" /> Create New Category
                            </>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-700 font-bold">Category Name</Label>
                            <Input 
                                id="name"
                                placeholder="e.g. Electronics, Grocery"
                                className={cn(
                                    "h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-blue-100 focus:border-blue-400 transition-all",
                                    errors.name && "border-red-300 focus:border-red-400 focus:ring-red-50"
                                )}
                                {...register("name")}
                            />
                            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button 
                                type="button"
                                variant="outline"
                                className="flex-1 h-12 rounded-xl border-slate-200 font-bold hover:bg-slate-50"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    editingCategory ? "Update Category" : "Save Category"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
