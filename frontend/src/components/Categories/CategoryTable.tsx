"use client";

import { 
    Tags, 
    Edit2,
    Trash2
} from "lucide-react";

interface CategoryTableProps {
    categories: any[];
    isLoading: boolean;
    onEdit: (category: any) => void;
    onDelete: (id: string) => void;
}

export function CategoryTable({ categories, isLoading, onEdit, onDelete }: CategoryTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider font-bold">
                        <th className="px-4 py-4 font-bold">Category Name</th>
                        <th className="px-4 py-4 font-bold">Created Date</th>
                        <th className="px-4 py-4 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <tr key={i} className="animate-pulse">
                                <td className="px-4 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                                <td className="px-4 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                                <td className="px-4 py-4"><div className="h-4 bg-slate-100 rounded w-8 ml-auto" /></td>
                            </tr>
                        ))
                    ) : categories.length > 0 ? (
                        categories.map((cat) => (
                            <tr key={cat._id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                                            <Tags size={14} />
                                        </div>
                                        <span className="font-semibold text-slate-700">{cat.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-500">
                                    {new Date(cat.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => onEdit(cat)}
                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg transition-all shadow-none hover:shadow-sm"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(cat._id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all shadow-none hover:shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-4 py-12 text-center text-slate-400 font-medium">
                                No categories found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
