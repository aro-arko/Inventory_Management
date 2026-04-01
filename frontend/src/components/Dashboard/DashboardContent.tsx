"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/DashboardService";
import {
    ShoppingCart,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    AlertCircle,
    CheckCircle2,
    Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const RevenueChart = dynamic(() => import("@/components/Dashboard/RevenueChart"), { ssr: false });

export function DashboardContent() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDashboardStats();
                if (res.success) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl" />
                    <div className="h-96 bg-slate-200 rounded-2xl" />
                </div>
            </div>
        );
    }

    const calculateTrend = (current: number, previous: number) => {
        if (!previous || previous === 0) {
            return {
                label: current > 0 ? "+100%" : "0%",
                isPositive: true
            };
        }
        const pct = ((current - previous) / previous) * 100;
        return {
            label: `${pct >= 0 ? "+" : ""}${pct.toFixed(pct % 1 === 0 ? 0 : 1)}%`,
            isPositive: pct >= 0
        };
    };

    const todayData = stats?.chartData?.[6] || { orders: 0, revenue: 0 };
    const yesterdayData = stats?.chartData?.[5] || { orders: 0, revenue: 0 };

    const ordersTrend = calculateTrend(todayData.orders, yesterdayData.orders);
    const revenueTrend = calculateTrend(todayData.revenue, yesterdayData.revenue);

    const totalProducts = stats?.totalProductsCount || 0;
    const lowStockCount = stats?.lowStockItemsCount || 0;
    const stockHealthPct = totalProducts > 0 
        ? Math.round(((totalProducts - lowStockCount) / totalProducts) * 100) 
        : 100;

    const statCards = [
        {
            title: "Total Orders Today",
            value: stats?.totalOrdersToday || 0,
            icon: ShoppingCart,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: ordersTrend.label,
            isPositive: ordersTrend.isPositive
        },
        {
            title: "Revenue Today",
            value: `$${stats?.revenueToday?.toLocaleString() || "0"}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            trend: revenueTrend.label,
            isPositive: revenueTrend.isPositive
        },
        {
            title: "Pending Orders",
            value: stats?.pendingVsCompleted?.Pending || 0,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
            trend: (stats?.pendingVsCompleted?.Pending || 0) > 0 ? "Action Req." : "Clear",
            isPositive: (stats?.pendingVsCompleted?.Pending || 0) === 0
        },
        {
            title: "Low Stock Items",
            value: lowStockCount,
            icon: lowStockCount > 0 ? AlertCircle : CheckCircle2,
            color: lowStockCount > 0 ? "text-rose-600" : "text-emerald-600",
            bg: lowStockCount > 0 ? "bg-rose-50" : "bg-emerald-50",
            trend: lowStockCount > 0 ? "Action Req." : `${stockHealthPct}% Healthy`,
            isPositive: lowStockCount === 0
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back! Here&apos;s what&apos;s happening with your inventory today.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-3 rounded-xl", card.bg, card.color)}>
                                    <card.icon size={24} />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                                    card.isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                                )}>
                                    {card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {card.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900">Revenue Analytics</CardTitle>
                            <CardDescription>Daily revenue performance for the last 7 days</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-semibold text-slate-600 border border-slate-100">
                                Last 7 Days
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <RevenueChart data={stats?.chartData || []} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900">Recent Activity</CardTitle>
                        <CardDescription>Latest system actions and updates</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {stats?.recentActivities?.length > 0 ? (
                                stats.recentActivities.map((activity: string, i: number) => {
                                    const [time, message] = activity.split(" — ");
                                    return (
                                        <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 transition-colors">
                                            <div className="mt-1 shrink-0">
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-800 font-medium leading-snug">
                                                    {message}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <Clock size={12} />
                                                    <span className="text-xs">{time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-12 text-center">
                                    <Clock className="mx-auto text-slate-200 mb-3" size={32} />
                                    <p className="text-slate-500 text-sm">No recent activity found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-8">
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-slate-900">Stock Insights</CardTitle>
                                <CardDescription>Overview of low stock and critical items</CardDescription>
                            </div>
                            <Link href="/restock-queue">
                                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold gap-2">
                                    Manage Queue <TrendingUp size={16} />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            {stats?.productSummary?.map((summary: string, i: number) => {
                                const isLow = summary.includes("(Low Stock)");
                                const isOut = summary.includes("(Out of Stock)");
                                const name = summary.split(" — ")[0];
                                const stockInfo = summary.split(" — ")[1]?.split(" (")[0] || "";
                                
                                return (
                                    <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                                isOut ? "bg-red-50 text-red-600" : isLow ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
                                            )}>
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{name}</p>
                                                <p className="text-sm text-slate-500">{stockInfo}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset",
                                            isOut 
                                                ? "bg-red-50 text-red-700 ring-red-100" 
                                                : isLow 
                                                    ? "bg-orange-50 text-orange-700 ring-orange-100" 
                                                    : "bg-emerald-50 text-emerald-700 ring-emerald-100"
                                        )}>
                                            {isOut ? "Out of Stock" : isLow ? "Low Stock" : "Healthy"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
