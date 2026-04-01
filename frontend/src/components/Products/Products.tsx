/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "@/services/ProductService";
import { getAllCategories } from "@/services/CategoryService";
import {
    Plus,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/Dashboard/PageHeader";
import { ProductTable } from "@/components/Products/ProductTable";
import { ProductFormModal } from "@/components/Products/ProductFormModal";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { TProduct } from "@/types/products/product.type";
import { cn } from "@/lib/utils";

const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    category: z.string().min(1, "Please select a category"),
    price: z.coerce.number().min(0, "Price must be positive"),
    stockQuantity: z.coerce.number().min(0, "Stock cannot be negative"),
    minimumStockThreshold: z.coerce.number().min(0, "Threshold cannot be negative"),
    status: z.enum(["Active", "Out of Stock"]).default("Active"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

const Products = () => {
    const [products, setProducts] = useState<TProduct[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [meta, setMeta] = useState<any>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            status: "Active",
        }
    });

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

            if (selectedCategory !== "all") query.category = selectedCategory;

            const [prodRes, catRes] = await Promise.all([
                getAllProducts(query),
                getAllCategories()
            ]);

            if (prodRes.success) {
                // Backend returns { success, message, data: { meta, result } }
                const resultData = prodRes.data || {};
                const productResult = Array.isArray(resultData.result) ? resultData.result : resultData;
                setProducts(Array.isArray(productResult) ? productResult : []);
                if (resultData.meta) setMeta(resultData.meta);
            }

            if (catRes.success) {
                const data = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.result || catRes.data?.data || []);
                setCategories(data);
            }
        } catch (error) {
            toast.error("Failed to load products or categories");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
    }, [page, debouncedSearch, selectedCategory]);

    // Reset pagination when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, selectedCategory]);

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            let res;
            if (editingProduct) {
                res = await updateProduct(editingProduct._id, data);
            } else {
                res = await createProduct(data);
            }

            if (res.success) {
                toast.success(editingProduct ? "Product updated" : "Product created");
                setIsModalOpen(false);
                reset();
                setEditingProduct(null);
                void fetchData();
            } else {
                toast.error(res.message || "Operation failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTrigger = (id: string) => {
        setProductToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleActualDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            const res = await deleteProduct(productToDelete);
            if (res.success) {
                toast.success("Product deleted successfully");
                setIsConfirmOpen(false);
                setProductToDelete(null);
                void fetchData();
            } else {
                toast.error(res.message || "Failed to delete product");
            }
        } catch (error) {
            toast.error("Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (product: TProduct) => {
        setEditingProduct(product);
        setValue("name", product.name);
        setValue("category", typeof product.category === 'object' ? product.category._id : product.category);
        setValue("price", product.price);
        setValue("stockQuantity", product.stockQuantity);
        setValue("minimumStockThreshold", product.minimumStockThreshold);
        setValue("status", product.status);
        setIsModalOpen(true);
    };

    const filteredProducts = products;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Products"
                description="Add, edit, and keep track of your full inventory."
                actionLabel="Add Product"
                actionIcon={<Plus size={20} />}
                onAction={() => {
                    setEditingProduct(null);
                    reset({ status: "Active" });
                    setIsModalOpen(true);
                }}
            />

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search by product name..."
                        className="pl-10 h-11 bg-slate-50 border-transparent focus:bg-white focus:border-blue-200 rounded-xl transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className="h-11 px-4 rounded-xl bg-slate-50 border-transparent focus:ring-2 focus:ring-blue-100 font-medium text-slate-600 outline-none"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <ProductTable
                products={filteredProducts}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteTrigger}
                onClearFilters={() => { setSearchTerm(""); setSelectedCategory("all"); }}
            />

            {/* Pagination Footer */}
            {meta && meta.totalPage > 1 && (
                <div className="mt-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-500">
                        Showing <span className="text-slate-900 font-bold">{(meta.page - 1) * meta.limit + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="text-slate-900 font-bold">{meta.total}</span> products
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 px-4 rounded-xl font-bold border-slate-200 hover:bg-slate-50 disabled:opacity-40"
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
                                            : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 px-4 rounded-xl font-bold border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                            onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
                            disabled={meta.page === meta.totalPage || isLoading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will move the product to deleted status. It will no longer appear in your active inventory.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsConfirmOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleActualDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Product"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                categories={categories}
                isSubmitting={isSubmitting}
                editingProduct={editingProduct}
            />
        </div>
    );
}

export default Products;