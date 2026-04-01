"use client";

import {
    Package,
    Edit2,
    Trash2,
    AlertCircle,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TProduct } from "@/types/products/product.type";

interface ProductTableProps {
    products: TProduct[];
    isLoading: boolean;
    onEdit: (product: TProduct) => void;
    onDelete: (id: string) => void;
    onClearFilters: () => void;
}

export function ProductTable({
    products,
    isLoading,
    onEdit,
    onDelete,
    onClearFilters
}: ProductTableProps) {
    return (
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-5">Product Info</th>
                                <th className="px-6 py-5">Category</th>
                                <th className="px-6 py-5">Price</th>
                                <th className="px-6 py-5">Stock Level</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3, 4].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-5"><div className="h-5 bg-slate-100 rounded w-48 mb-2" /><div className="h-3 bg-slate-50 rounded w-24" /></td>
                                        <td className="px-6 py-5"><div className="h-5 bg-slate-100 rounded w-24" /></td>
                                        <td className="px-6 py-5"><div className="h-5 bg-slate-100 rounded w-16" /></td>
                                        <td className="px-6 py-5"><div className="h-5 bg-slate-100 rounded w-32" /></td>
                                        <td className="px-6 py-5"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
                                        <td className="px-6 py-5"><div className="h-8 bg-slate-100 rounded w-20 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => {
                                    const isLowStock = product.stockQuantity < product.minimumStockThreshold && product.stockQuantity > 0;
                                    const isOutOfStock = product.stockQuantity === 0 || product.status === "Out of Stock";

                                    return (
                                        <tr key={product._id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm",
                                                        isOutOfStock ? "bg-slate-400" : "bg-blue-600"
                                                    )}>
                                                        <Package size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-[15px]">{product.name}</p>
                                                        <p className="text-xs text-slate-400 font-medium mt-0.5">ID: {product._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold ring-4 ring-white shadow-sm">
                                                    {typeof product.category === 'object' ? product.category.name : (product.category || "Uncategorized")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-[15px] font-bold text-slate-700">
                                                ${product.price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1.5 min-w-[140px]">
                                                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-0.5">
                                                        <span>{product.stockQuantity} / {product.minimumStockThreshold}</span>
                                                        <span className={cn(
                                                            isOutOfStock ? "text-red-600" : isLowStock ? "text-orange-600" : "text-emerald-600"
                                                        )}>
                                                            {isOutOfStock ? "Critical" : isLowStock ? "Low" : "Optimal"}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-500",
                                                                isOutOfStock ? "bg-red-500" : isLowStock ? "bg-orange-500" : "bg-emerald-500"
                                                            )}
                                                            style={{ width: `${Math.min((product.stockQuantity / (product.minimumStockThreshold * 2)) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1",
                                                    isOutOfStock
                                                        ? "bg-red-50 text-red-600 ring-red-100"
                                                        : "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                                )}>
                                                    {isOutOfStock ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <button
                                                        onClick={() => onEdit(product)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(product._id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <AlertCircle size={40} className="text-slate-200" />
                                            <p className="font-medium">No products match your search criteria</p>
                                            <Button variant="outline" className="h-9 rounded-lg" onClick={onClearFilters}>Clear Filters</Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
