/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { getAllCategories, createCategory, deleteCategory, updateCategory } from "@/services/CategoryService";
import { Plus, Search, Tags, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/Dashboard/PageHeader";
import { CategoryTable } from "@/components/Categories/CategoryTable";
import { CategoryFormModal } from "@/components/Categories/CategoryFormModal";

const categorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const Categories = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Deletion State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
    });

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await getAllCategories();
            if (res.success) {
                const data = Array.isArray(res.data) ? res.data : (res.data?.result || res.data?.data || []);
                setCategories(data);
            }
        } catch (error) {
            toast.error("Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchCategories();
    }, []);

    const onSubmit = async (data: CategoryFormValues) => {
        setIsSubmitting(true);
        try {
            let res;
            if (editingCategory) {
                res = await updateCategory(editingCategory._id, data);
            } else {
                res = await createCategory(data);
            }

            if (res.success) {
                toast.success(editingCategory ? "Category updated successfully" : "Category created successfully");
                setIsModalOpen(false);
                setEditingCategory(null);
                reset();
                void fetchCategories();
            } else {
                toast.error(res.message || "Failed to save category");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setValue("name", category.name);
        setIsModalOpen(true);
    };

    const handleDeleteTrigger = (id: string) => {
        setCategoryToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleActualDelete = async () => {
        if (!categoryToDelete) return;
        setIsDeleting(true);
        try {
            const res = await deleteCategory(categoryToDelete);
            if (res.success) {
                toast.success("Category deleted successfully");
                setIsConfirmOpen(false);
                setCategoryToDelete(null);
                void fetchCategories();
            } else {
                toast.error(res.message || "Failed to delete category");
            }
        } catch (error) {
            toast.error("Failed to delete category");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Categories"
                description="Manage your product categories and organization."
                actionLabel="Add Category"
                actionIcon={<Plus size={20} />}
                onAction={() => setIsModalOpen(true)}
            />

            {/* Search & Stats */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <Card className="border-none shadow-sm rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold">Category List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <Input
                                    placeholder="Search categories..."
                                    className="pl-10 h-11 bg-slate-50 border-slate-100 rounded-xl focus:ring-blue-100 focus:border-blue-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <CategoryTable
                                categories={filteredCategories}
                                isLoading={isLoading}
                                onEdit={handleEdit}
                                onDelete={handleDeleteTrigger}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Stats/Sidebar */}
                <div className="lg:w-80 space-y-6">
                    <Card className="border-none shadow-sm rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 text-white p-2">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <Tags size={24} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold">{categories.length}</h3>
                                    <p className="text-blue-100 text-sm font-medium">Total Categories</p>
                                </div>
                                <p className="text-xs text-blue-200">
                                    Organization helps in tracking product performance and filtering stock effectively.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                    reset();
                }}
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                editingCategory={editingCategory}
            />

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will mark the category as deleted. Products specifically assigned to this category may require re-assignment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsConfirmOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleActualDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Category"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default Categories;
