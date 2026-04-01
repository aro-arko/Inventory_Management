"use client";

import { useEffect, useState, useMemo } from "react";
import { getRestockQueue, restockProduct } from "@/services/ProductService";
import {
    AlertTriangle,
    RefreshCw,
    Package,
    ArrowUpRight,
    Info,
    Search,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

type Priority = "High" | "Medium" | "Low";

interface Product {
    _id: string;
    name: string;
    stockQuantity: number;
    minimumStockThreshold: number;
    priority?: Priority;
    status: string;
}

const RestockQueue = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isRestocking, setIsRestocking] = useState<string | null>(null);
    const [restockAmount, setRestockAmount] = useState<number>(10);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getRestockQueue();
            if (res.success) {
                const data = Array.isArray(res.data) ? res.data : (res.data?.result || res.data?.data || []);
                setProducts(data);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const restockQueue = useMemo(() => {
        return products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(p => {
                let priority: Priority = "Low";
                const ratio = p.stockQuantity / (p.minimumStockThreshold || 1);

                if (ratio <= 0.2) priority = "High";
                else if (ratio <= 0.5) priority = "Medium";

                return { ...p, priority };
            });
    }, [products, searchTerm]);

    const handleRestock = async (product: Product) => {
        setIsRestocking(product._id);
        try {
            const res = await restockProduct(product._id, restockAmount);
            if (res.success) {
                toast.success(`${product.name} restocked successfully (+${restockAmount})`);
                void fetchData();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Restock failed");
        } finally {
            setIsRestocking(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Restock Queue</h1>
                    <p className="text-slate-500">Prioritized list of items below minimum stock threshold.</p>
                </div>
            </div>

            {/* Priority Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm rounded-2xl bg-red-50/50 border border-red-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-red-900">{restockQueue.filter(p => p.priority === "High").length}</h3>
                                <p className="text-sm font-semibold text-red-700">High Priority (Critical)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl bg-amber-50/50 border border-amber-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                                <RefreshCw size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-amber-900">{restockQueue.filter(p => p.priority === "Medium").length}</h3>
                                <p className="text-sm font-semibold text-amber-700">Medium Priority</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl bg-blue-50/50 border border-blue-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                <Info size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-blue-900">{restockQueue.filter(p => p.priority === "Low").length}</h3>
                                <p className="text-sm font-semibold text-blue-700">Low Priority</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Search restock items..."
                            className="pl-10 h-12 bg-white border-slate-100 rounded-2xl focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <Card key={i} className="animate-pulse border-none shadow-sm h-24 rounded-2xl bg-white" />
                        ))
                    ) : restockQueue.length > 0 ? (
                        restockQueue
                            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((product) => (
                                <Card key={product._id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center font-bold",
                                                    product.priority === "High" ? "bg-red-50 text-red-600" : product.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                                )}>
                                                    <Package size={28} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                            product.priority === "High" ? "bg-red-600 text-white" : product.priority === "Medium" ? "bg-amber-500 text-white" : "bg-blue-600 text-white"
                                                        )}>
                                                            {product.priority} Priority
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
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-6 rounded-xl flex-1 md:flex-none shadow-lg shadow-blue-100 gap-2"
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
                        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Queue is Clear!</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2">All products are currently above their minimum stock thresholds.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold">Restock Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-700">Default Restock Amount</Label>
                                <div className="flex gap-2">
                                    {[10, 25, 50, 100].map(amount => (
                                        <button
                                            key={amount}
                                            onClick={() => setRestockAmount(amount)}
                                            className={cn(
                                                "flex-1 h-10 rounded-xl font-bold transition-all text-xs",
                                                restockAmount === amount
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                            )}
                                        >
                                            {amount}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative mt-2">
                                    <Input
                                        type="number"
                                        className="h-11 bg-slate-50 border-transparent rounded-xl pr-12 font-bold"
                                        value={restockAmount}
                                        onChange={(e) => setRestockAmount(Number(e.target.value))}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Units</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                                <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                    Manual restocking adds the specified quantity to your current stock level and automatically reactivates out-of-stock items.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default RestockQueue;