"use client";

import { useEffect, useState, useMemo } from "react";
import { getRestockQueue, restockProduct } from "@/services/ProductService";
import { toast } from "sonner";
import { PageHeader } from "@/components/Dashboard/PageHeader";
import { PrioritySummary } from "@/components/RestockQueue/PrioritySummary";
import { RestockList } from "@/components/RestockQueue/RestockList";
import { RestockSettings } from "@/components/RestockQueue/RestockSettings";

type Priority = "High" | "Medium" | "Low";

interface Product {
    _id: string;
    name: string;
    stockQuantity: number;
    minimumStockThreshold: number;
    priority?: Priority;
    status: string;
}

export default function RestockQueue() {
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
        } catch (error) {
            toast.error("Restock failed");
        } finally {
            setIsRestocking(null);
        }
    };

    const counts = {
        high: restockQueue.filter(p => p.priority === "High").length,
        medium: restockQueue.filter(p => p.priority === "Medium").length,
        low: restockQueue.filter(p => p.priority === "Low").length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <PageHeader
                title="Restock Queue"
                description="Prioritized list of items below minimum stock threshold."
            />

            <PrioritySummary
                highCount={counts.high}
                mediumCount={counts.medium}
                lowCount={counts.low}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <RestockList
                        products={restockQueue}
                        isLoading={isLoading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleRestock={handleRestock}
                        isRestocking={isRestocking}
                    />
                </div>

                <div className="lg:sticky lg:top-8">
                    <RestockSettings
                        restockAmount={restockAmount}
                        setRestockAmount={setRestockAmount}
                    />
                </div>
            </div>
        </div>
    );
}
