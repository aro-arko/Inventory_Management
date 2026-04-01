"use client";

import { 
    Plus, 
    Edit2, 
    Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { TProduct } from "@/types/products/product.type";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ProductFormValues } from "./Products";

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: UseFormRegister<ProductFormValues>;
    errors: FieldErrors<ProductFormValues>;
    setValue: UseFormSetValue<ProductFormValues>;
    watch: UseFormWatch<ProductFormValues>;
    categories: any[];
    isSubmitting: boolean;
    editingProduct: TProduct | null;
}

export function ProductFormModal({
    isOpen,
    onClose,
    onSubmit,
    register,
    errors,
    setValue,
    watch,
    categories,
    isSubmitting,
    editingProduct
}: ProductFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200" 
                onClick={() => !isSubmitting && onClose()} 
            />
            <Card className="relative w-full max-w-2xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-200">
                <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-xl text-white">
                                {editingProduct ? <Edit2 size={24} /> : <Plus size={24} />}
                            </div>
                            {editingProduct ? "Update Product" : "Add New Product"}
                        </CardTitle>
                        <CardDescription className="mt-1">Fill in the details to manage your inventory item.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-700 font-bold ml-1">Product Name</Label>
                                    <Input 
                                        id="name"
                                        placeholder="e.g. iPhone 15 Pro"
                                        className={cn("h-12 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-blue-50 transition-all", errors.name && "border-red-300")}
                                        {...register("name")}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name.message?.toString()}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-slate-700 font-bold ml-1">Category</Label>
                                    <select 
                                        id="category"
                                        className={cn("w-full h-12 bg-slate-50 border-transparent rounded-2xl px-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-slate-700", errors.category && "border-red-300")}
                                        {...register("category")}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-xs text-red-500 font-semibold">{errors.category.message?.toString()}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-slate-700 font-bold ml-1">Price ($)</Label>
                                    <Input 
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={cn("h-12 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-blue-50 transition-all", errors.price && "border-red-300")}
                                        {...register("price")}
                                    />
                                    {errors.price && <p className="text-xs text-red-500 font-semibold">{errors.price.message?.toString()}</p>}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="stockQuantity" className="text-slate-700 font-bold ml-1">Initial Stock</Label>
                                    <Input 
                                        id="stockQuantity"
                                        type="number"
                                        placeholder="0"
                                        className={cn("h-12 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-blue-50 transition-all", errors.stockQuantity && "border-red-300")}
                                        {...register("stockQuantity")}
                                    />
                                    {errors.stockQuantity && <p className="text-xs text-red-500 font-semibold">{errors.stockQuantity.message?.toString()}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minimumStockThreshold" className="text-slate-700 font-bold ml-1">Min. Stock Alert Threshold</Label>
                                    <Input 
                                        id="minimumStockThreshold"
                                        type="number"
                                        placeholder="5"
                                        className={cn("h-12 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-blue-50 transition-all", errors.minimumStockThreshold && "border-red-300")}
                                        {...register("minimumStockThreshold")}
                                    />
                                    {errors.minimumStockThreshold && <p className="text-xs text-red-500 font-semibold">{errors.minimumStockThreshold.message?.toString()}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-slate-700 font-bold ml-1">Initial Status</Label>
                                    <div className="flex gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setValue("status", "Active")}
                                            className={cn(
                                                "flex-1 h-12 rounded-2xl border-2 font-bold transition-all text-sm uppercase tracking-wide",
                                                watch("status") === "Active" 
                                                    ? "bg-blue-50 border-blue-600 text-blue-600 shadow-sm" 
                                                    : "bg-slate-50 border-transparent text-slate-400"
                                            )}
                                        >
                                            Active
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setValue("status", "Out of Stock")}
                                            className={cn(
                                                "flex-1 h-12 rounded-2xl border-2 font-bold transition-all text-sm uppercase tracking-wide",
                                                watch("status") === "Out of Stock" 
                                                    ? "bg-red-50 border-red-600 text-red-600 shadow-sm" 
                                                    : "bg-slate-50 border-transparent text-slate-400"
                                            )}
                                        >
                                            Out Stock
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button 
                                type="button"
                                variant="outline"
                                className="flex-1 h-14 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-base"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Discard
                            </Button>
                            <Button 
                                type="submit"
                                className="flex-[2] h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        {editingProduct ? "Update Product Details" : "Create New Product Entry"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
