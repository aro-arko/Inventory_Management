"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TChartData } from "@/types/dashboard/dashboard.type";

export default function RevenueChart({ data }: { data: TChartData[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const maxRevenue = useMemo(() => Math.max(...data.map(d => d.revenue), 1000), [data]);
    const maxOrders = useMemo(() => Math.max(...data.map(d => d.orders), 10), [data]);

    const padding = { top: 40, right: 40, bottom: 40, left: 60 };
    const chartWidth = dimensions.width;
    const chartHeight = dimensions.height;

    const getX = (index: number) => padding.left + (index * (chartWidth - padding.left - padding.right)) / (data.length - 1);
    const getY = (value: number) => chartHeight - padding.bottom - (value / maxRevenue) * (chartHeight - padding.top - padding.bottom);
    const getOrderY = (value: number) => chartHeight - padding.bottom - (value / maxOrders) * (chartHeight - padding.top - padding.bottom);

    const linePath = useMemo(() => {
        if (data.length < 2) return "";
        let path = `M ${getX(0)} ${getY(data[0].revenue)}`;

        for (let i = 0; i < data.length - 1; i++) {
            const x1 = getX(i);
            const y1 = getY(data[i].revenue);
            const x2 = getX(i + 1);
            const y2 = getY(data[i + 1].revenue);

            const cx = (x1 + x2) / 2;
            path += ` C ${cx},${y1} ${cx},${y2} ${x2},${y2}`;
        }
        return path;
    }, [data, dimensions, maxRevenue]);

    const areaPath = useMemo(() => {
        if (!linePath) return "";
        return `${linePath} V ${chartHeight - padding.bottom} H ${padding.left} Z`;
    }, [linePath, chartHeight]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || data.length === 0) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - padding.left;
        const step = (chartWidth - padding.left - padding.right) / (data.length - 1);
        const index = Math.round(x / step);
        if (index >= 0 && index < data.length) {
            setActiveIndex(index);
        }
    };

    if (data.length === 0) return (
        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
            No data available for the last 7 days
        </div>
    );

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setActiveIndex(null)}
        >
            <svg
                width={chartWidth}
                height={chartHeight}
                className="overflow-visible"
            >
                {/* Horizontal Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => {
                    const value = (maxRevenue / 4) * i;
                    const y = getY(value);
                    return (
                        <g key={i}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={chartWidth - padding.right}
                                y2={y}
                                stroke="#f1f5f9"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={padding.left - 12}
                                y={y + 4}
                                textAnchor="end"
                                className="text-[11px] font-bold fill-slate-400"
                            >
                                ${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                            </text>
                        </g>
                    );
                })}

                {/* Vertical interactive line */}
                {activeIndex !== null && (
                    <line
                        x1={getX(activeIndex)}
                        y1={padding.top}
                        x2={getX(activeIndex)}
                        y2={chartHeight - padding.bottom}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="animate-in fade-in duration-300"
                    />
                )}

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Orders (Background Minimal Bars) */}
                {data.map((d, i) => {
                    const x = getX(i);
                    const y = getOrderY(d.orders);
                    const barWidth = 10;
                    return (
                        <rect
                            key={i}
                            x={x - barWidth / 2}
                            y={y}
                            width={barWidth}
                            height={chartHeight - padding.bottom - y}
                            fill="#e2e8f0"
                            rx="4"
                            className="opacity-40"
                        />
                    );
                })}

                {/* Revenue Area */}
                <path
                    d={areaPath}
                    fill="url(#revenueGradient)"
                />

                {/* Revenue Line */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-sm transition-all duration-700 ease-out"
                />

                {/* Data points */}
                {data.map((d, i) => {
                    const x = getX(i);
                    const y = getY(d.revenue);
                    const isActive = activeIndex === i;
                    return (
                        <g key={i}>
                            {/* Hotspot circle */}
                            <circle
                                cx={x}
                                cy={y}
                                r={isActive ? "7" : "5"}
                                fill="white"
                                stroke={isActive ? "#1d4ed8" : "#3b82f6"}
                                strokeWidth={isActive ? "3" : "2"}
                                className="transition-all duration-200 cursor-pointer shadow-sm"
                            />
                            {/* X-Axis labels */}
                            <text
                                x={x}
                                y={chartHeight - padding.bottom + 25}
                                textAnchor="middle"
                                className={cn(
                                    "text-[11px] font-bold transition-colors",
                                    isActive ? "fill-slate-900" : "fill-slate-400"
                                )}
                            >
                                {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Dynamic Tooltip */}
            {activeIndex !== null && (
                <div
                    className="absolute z-50 pointer-events-none transition-all duration-150 ease-out animate-in zoom-in-95"
                    style={{
                        left: getX(activeIndex),
                        top: getY(data[activeIndex].revenue) - 100,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-4 min-w-[140px] flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {new Date(data[activeIndex].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">Revenue:</span>
                                <span className="text-sm font-black text-blue-600">${data[activeIndex].revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-600">Orders:</span>
                                <span className="text-sm font-black text-slate-900">{data[activeIndex].orders} units</span>
                            </div>
                        </div>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="w-4 h-4 bg-white rotate-45 border-r border-b border-slate-200 absolute -bottom-2 left-1/2 -ms-2" />
                </div>
            )}
        </div>
    );
}
