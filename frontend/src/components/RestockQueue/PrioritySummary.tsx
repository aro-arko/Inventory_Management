"use client";

import { 
    AlertTriangle, 
    RefreshCw, 
    Info 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PrioritySummaryProps {
    highCount: number;
    mediumCount: number;
    lowCount: number;
}

export function PrioritySummary({ highCount, mediumCount, lowCount }: PrioritySummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm rounded-2xl bg-red-50/50 border border-red-100 transition-all hover:shadow-md">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-red-900">{highCount}</h3>
                            <p className="text-sm font-semibold text-red-700">High Priority (Critical)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl bg-amber-50/50 border border-amber-100 transition-all hover:shadow-md">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-amber-900">{mediumCount}</h3>
                            <p className="text-sm font-semibold text-amber-700">Medium Priority</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl bg-blue-50/50 border border-blue-100 transition-all hover:shadow-md">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            <Info size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-blue-900">{lowCount}</h3>
                            <p className="text-sm font-semibold text-blue-700">Low Priority</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
