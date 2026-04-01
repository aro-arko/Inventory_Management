"use client";

import { 
    Search, 
    Package, 
    ArrowUpRight, 
    Loader2, 
    CheckCircle2 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RestockListProps {
    products: any[];
    isLoading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    handleRestock: (product: any) => void;
    isRestocking: string | null;
}

export function RestockList({
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    handleRestock,
    isRestocking
}: RestockListProps) {
    const displayProducts = products;

    return (
        <div className="space-y-4">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input
                    placeholder="Search restock items..."
                    className="pl-10 h-12 bg-white border-slate-100 rounded-2xl focus:ring-blue-100 focus:border-blue-400 transition-all font-medium shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                [1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse border-none shadow-sm h-28 rounded-2xl bg-white" />
                ))
            ) : displayProducts.length > 0 ? (
                displayProducts.map((product) => (
                    <Card key={product._id} className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden bg-white group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-transform group-hover:scale-105 duration-300",
                                        product.priority === "High" ? "bg-red-50 text-red-600" : product.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                    )}>
                                        <Package size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">{product.name}</h3>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                product.priority === "High" ? "bg-red-600 text-white" : product.priority === "Medium" ? "bg-amber-500 text-white" : "bg-blue-600 text-white"
                                            )}>
                                                {product.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Current: <span className="text-slate-900 font-bold">{product.stockQuantity}</span> / Threshold: <span className="text-slate-900 font-bold">{product.minimumStockThreshold}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                                    <div className="hidden sm:block text-right mr-4">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Stock Status</p>
                                        <p className={cn(
                                            "text-sm font-black",
                                            product.priority === "High" ? "text-red-500" : "text-amber-500"
                                        )}>
                                            {Math.round((product.stockQuantity / product.minimumStockThreshold) * 100)}% Level
                                        </p>
                                    </div>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-6 rounded-xl flex-1 md:flex-none shadow-lg shadow-blue-100 gap-2 transition-all active:scale-95"
                                        onClick={() => handleRestock(product)}
                                        disabled={isRestocking === product._id}
                                    >
                                        {isRestocking === product._id ? <Loader2 className="animate-spin" size={20} /> : <ArrowUpRight size={20} />}
                                        Quick Restock
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Queue is Clear!</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">All products are currently above their minimum stock thresholds.</p>
                </div>
            )}
        </div>
    );
}
