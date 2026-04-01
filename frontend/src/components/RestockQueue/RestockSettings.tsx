"use client";

import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RestockSettingsProps {
    restockAmount: number;
    setRestockAmount: (amount: number) => void;
}

export function RestockSettings({ restockAmount, setRestockAmount }: RestockSettingsProps) {
    return (
        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden transition-all hover:shadow-md">
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
                            className="h-11 bg-slate-50 border-transparent rounded-xl pr-12 font-bold focus:bg-white focus:border-blue-200 transition-all"
                            value={restockAmount}
                            onChange={(e) => setRestockAmount(Number(e.target.value))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Units</span>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        Manual restocking adds the specified quantity to your current stock level and automatically reactivates out-of-stock items.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
