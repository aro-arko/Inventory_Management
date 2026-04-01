/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllOrders, createOrder, updateOrderStatus, cancelOrder } from "@/services/OrderService";
import { getAllProducts } from "@/services/ProductService";
import {
    Plus,
    Search,
    ShoppingCart,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    Package,
    ArrowRight,
    Trash2,
    Loader2,
    AlertTriangle,
    BadgeAlert,
    ChevronDown,
    User,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const orderSchema = z.object({
    customerName: z.string().min(2, "Customer name is required"),
    products: z.array(z.object({
        product: z.string().min(1, "Product is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    })).min(1, "Add at least one product"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const statusColors: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-600 ring-amber-100",
    Confirmed: "bg-blue-50 text-blue-600 ring-blue-100",
    Shipped: "bg-purple-50 text-purple-600 ring-purple-100",
    Delivered: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    Cancelled: "bg-red-50 text-red-600 ring-red-100",
};

const statusIcons: Record<string, any> = {
    Pending: Clock,
    Confirmed: CheckCircle2,
    Shipped: Truck,
    Delivered: Package,
    Cancelled: XCircle,
};

const Orders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedDate, setSelectedDate] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [meta, setMeta] = useState<any>(null);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: { products: [{ product: "", quantity: 1 }] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
    });

    const watchedProducts = watch("products");

    // Search Debouncing
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const query: Record<string, any> = {
                page,
                limit,
                searchTerm: debouncedSearch,
            };

            if (statusFilter !== "all") query.status = statusFilter;
            if (selectedDate) query.date = selectedDate;

            const [orderRes, prodRes] = await Promise.all([
                getAllOrders(query),
                getAllProducts()
            ]);

            if (orderRes.success) {
                // Backend returns { success, message, data: { meta, result } }
                const resultData = orderRes.data || {};
                const orderResult = Array.isArray(resultData.result) ? resultData.result : resultData;
                setOrders(Array.isArray(orderResult) ? orderResult : []);
                if (resultData.meta) setMeta(resultData.meta);
            }

            if (prodRes.success) {
                const data = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.result || prodRes.data?.data || []);
                setProducts(data);
            }
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
    }, [page, debouncedSearch, statusFilter, selectedDate]);

    // Reset pagination when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, selectedDate]);

    const onSubmit = async (data: OrderFormValues) => {
        // Double check conflicts and stock
        const productIds = data.products.map(p => p.product);
        if (new Set(productIds).size !== productIds.length) {
            toast.error("Duplicate products found in order");
            return;
        }

        for (const item of data.products) {
            const prod = products.find(p => p._id === item.product);
            if (prod && item.quantity > prod.stockQuantity) {
                toast.error(`Only ${prod.stockQuantity} items available for ${prod.name}`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const res = await createOrder(data);
            if (res.success) {
                toast.success("Order created successfully");
                setIsModalOpen(false);
                reset();
                void fetchData();
            } else {
                toast.error(res.message || "Failed to create order");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await updateOrderStatus(id, status);
            if (res.success) {
                toast.success(`Order status updated to ${status}`);
                void fetchData();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this order? Stock will be restored.")) return;
        try {
            const res = await cancelOrder(id);
            if (res.success) {
                toast.success("Order cancelled");
                void fetchData();
            }
        } catch (error) {
            toast.error("Failed to cancel order");
        }
    };

    const calculateTotal = useMemo(() => {
        return watchedProducts.reduce((sum, item) => {
            const prod = products.find(p => p._id === item.product);
            return sum + (prod?.price || 0) * (item.quantity || 0);
        }, 0);
    }, [watchedProducts, products]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orders</h1>
                    <p className="text-slate-500">Track and manage customer fulfillment workflows.</p>
                </div>
                <Button
                    onClick={() => { reset(); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 h-11 px-6 rounded-xl shadow-lg border-2 border-blue-100"
                >
                    <Plus size={20} /> New Customer Order
                </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search by customer or order ID..."
                        className="pl-10 h-11 bg-slate-50 border-transparent focus:bg-white focus:border-blue-200 transition-all rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="h-11 px-4 rounded-xl bg-slate-50 border-transparent focus:ring-2 focus:ring-blue-100 font-medium text-slate-600 outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex items-center gap-2 px-4 bg-slate-50 rounded-xl text-slate-500 font-medium border-2 border-transparent focus-within:border-blue-200 transition-all">
                    <Calendar size={18} className="text-slate-400" />
                    <Input
                        type="date"
                        className="bg-transparent border-none focus-visible:ring-0 h-11 p-0 text-sm font-semibold text-slate-600"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Order List */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-5">Order ID & Customer</th>
                                    <th className="px-6 py-5">Items</th>
                                    <th className="px-6 py-5">Total Amount</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Fulfillment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-5"><div className="h-5 bg-slate-100 rounded w-48 mb-2" /><div className="h-3 bg-slate-50 rounded w-24" /></td>
                                            <td className="px-6 py-5"><div className="h-5 bg-slate-100 rounded w-24" /></td>
                                            <td className="px-6 py-5"><div className="h-5 bg-slate-100 rounded w-16" /></td>
                                            <td className="px-6 py-5"><div className="h-6 bg-slate-100 rounded-full w-24" /></td>
                                            <td className="px-6 py-5"><div className="h-8 bg-slate-100 rounded w-32 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : orders.length > 0 ? (
                                    orders.map((order) => {
                                        const StatusIcon = statusIcons[order.status] || Info;
                                        return (
                                            <tr key={order._id} className="group hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-slate-800">#{order._id.slice(-6).toUpperCase()}</span>
                                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                                            <User size={14} className="text-slate-300" />
                                                            {order.customerName}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex -space-x-3">
                                                        {order.products.slice(0, 3).map((p: any, i: number) => (
                                                            <div key={i} className="w-9 h-9 rounded-xl bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm" title={p.product?.name}>
                                                                {p.quantity}x
                                                            </div>
                                                        ))}
                                                        {order.products.length > 3 && (
                                                            <div className="w-9 h-9 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-slate-400 text-[10px] font-bold">
                                                                +{order.products.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="font-bold text-slate-800">${order.totalPrice.toLocaleString()}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1",
                                                        statusColors[order.status]
                                                    )}>
                                                        <StatusIcon size={12} />
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {order.status === "Pending" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-blue-600 hover:bg-blue-50 font-bold px-3 text-xs gap-1.5"
                                                                onClick={() => handleUpdateStatus(order._id, "Confirmed")}
                                                            >
                                                                Confirm <ArrowRight size={12} />
                                                            </Button>
                                                        )}
                                                        {order.status === "Confirmed" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-purple-600 hover:bg-purple-50 font-bold px-3 text-xs gap-1.5"
                                                                onClick={() => handleUpdateStatus(order._id, "Shipped")}
                                                            >
                                                                Ship <Truck size={12} />
                                                            </Button>
                                                        )}
                                                        {order.status === "Shipped" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-emerald-600 hover:bg-emerald-50 font-bold px-3 text-xs gap-1.5"
                                                                onClick={() => handleUpdateStatus(order._id, "Delivered")}
                                                            >
                                                                Deliver <Package size={12} />
                                                            </Button>
                                                        )}
                                                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                                                            <button
                                                                onClick={() => handleCancel(order._id)}
                                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                title="Cancel Order"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <ShoppingCart size={48} className="text-slate-100" />
                                                <p className="text-slate-500 font-medium">No orders found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {meta && meta.totalPage > 1 && (
                        <div className="p-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                            <p className="text-sm font-medium text-slate-500">
                                Showing <span className="text-slate-900 font-bold">{(meta.page - 1) * meta.limit + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="text-slate-900 font-bold">{meta.total}</span> orders
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 rounded-xl font-bold border-slate-200 hover:bg-white disabled:opacity-40"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={meta.page === 1 || isLoading}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1 px-2">
                                    {[...Array(meta.totalPage)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setPage(i + 1)}
                                            className={cn(
                                                "w-10 h-10 rounded-xl font-bold text-sm transition-all",
                                                meta.page === i + 1
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                            )}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 rounded-xl font-bold border-slate-200 hover:bg-white disabled:opacity-40"
                                    onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
                                    disabled={meta.page === meta.totalPage || isLoading}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal for New Order form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200"
                        onClick={() => !isSubmitting && setIsModalOpen(false)}
                    />
                    <Card className="relative w-full max-w-2xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-200 h-[90vh] flex flex-col">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 shrink-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                        <div className="p-2 bg-blue-600 rounded-xl text-white">
                                            <Plus size={24} />
                                        </div>
                                        Create Fulfillment Order
                                    </CardTitle>
                                    <CardDescription className="mt-1">Fill in the items and customer information.</CardDescription>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Total</p>
                                    <p className="text-3xl font-black text-blue-600">${calculateTotal.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-8">
                                <div className="space-y-4">
                                    <Label htmlFor="customerName" className="text-slate-700 font-bold ml-1 text-lg flex items-center gap-2">
                                        <User size={18} className="text-blue-500" /> Customer Information
                                    </Label>
                                    <Input
                                        id="customerName"
                                        placeholder="Full Name (e.g. John Doe)"
                                        className={cn("h-13 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 font-medium px-5", errors.customerName && "border-red-300")}
                                        {...register("customerName")}
                                    />
                                    {errors.customerName && <p className="text-xs text-red-500 font-bold ml-1">{errors.customerName.message}</p>}
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-700 font-bold ml-1 text-lg flex items-center gap-2">
                                            <Package size={18} className="text-blue-500" /> Selected Products
                                        </Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => append({ product: "", quantity: 1 })}
                                            className="text-blue-600 hover:bg-blue-50 font-bold h-9 rounded-xl border border-blue-100"
                                        >
                                            <Plus size={16} className="mr-2" /> Add Item
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {fields.map((field, index) => {
                                            const selectedPid = watchedProducts[index]?.product;
                                            const selectedProd = products.find(p => p._id === selectedPid);
                                            const availableStock = selectedProd?.stockQuantity || 0;
                                            const isStockExceeded = (watchedProducts[index]?.quantity || 0) > availableStock;

                                            // Check for duplicates
                                            const isDuplicate = watchedProducts.filter((p, i) => i !== index && p.product === selectedPid && selectedPid !== "").length > 0;

                                            return (
                                                <div key={field.id} className="group relative p-6 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-3xl transition-all shadow-none hover:shadow-xl hover:shadow-slate-100/50">
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                                        <div className="md:col-span-1 flex items-center justify-center pt-2">
                                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 font-black text-xs flex items-center justify-center">
                                                                {index + 1}
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-6 space-y-2">
                                                            <select
                                                                className={cn(
                                                                    "w-full h-12 bg-white border-transparent rounded-2xl px-4 outline-none transition-all font-semibold text-slate-700 border-2",
                                                                    errors.products?.[index]?.product ? "border-red-300" : isDuplicate ? "border-amber-400" : "border-white"
                                                                )}
                                                                {...register(`products.${index}.product` as const)}
                                                            >
                                                                <option value="">Choose a product...</option>
                                                                {products.map(p => (
                                                                    <option
                                                                        key={p._id}
                                                                        value={p._id}
                                                                        disabled={p.status !== "Active" || p.stockQuantity === 0}
                                                                        className={p.status !== "Active" ? "text-slate-300" : ""}
                                                                    >
                                                                        {p.name} - ${p.price} ({p.stockQuantity} in stock)
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {isDuplicate && <p className="text-[10px] text-amber-600 font-bold ml-1 flex items-center gap-1"><AlertTriangle size={10} /> Already added in this order</p>}
                                                        </div>

                                                        <div className="md:col-span-3 space-y-2">
                                                            <div className="relative">
                                                                <Input
                                                                    type="number"
                                                                    className={cn(
                                                                        "h-12 bg-white border-transparent rounded-2xl text-center font-bold px-8 border-2",
                                                                        isStockExceeded ? "border-red-400 text-red-600" : "border-white"
                                                                    )}
                                                                    {...register(`products.${index}.quantity` as const)}
                                                                />
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[10px] uppercase">Qty</span>
                                                            </div>
                                                            {isStockExceeded && <p className="text-[10px] text-red-600 font-bold ml-1 flex items-center gap-1"><BadgeAlert size={10} /> Only {availableStock} left</p>}
                                                        </div>

                                                        <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                                                            <div className="text-right mr-2">
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Subtotal</p>
                                                                <p className="font-bold text-slate-800">${((selectedProd?.price || 0) * (watchedProducts[index]?.quantity || 0)).toLocaleString()}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                                                                disabled={fields.length === 1}
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </form>
                        </CardContent>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0 flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 h-14 rounded-3xl border-slate-200 font-bold text-slate-600 hover:bg-white text-lg"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSubmitting}
                            >
                                Discard Order
                            </Button>
                            <Button
                                form="order-form"
                                type="submit"
                                className="flex-2 h-14 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        Submit and Place Order <ArrowRight size={20} />
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default Orders;
