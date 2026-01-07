import React, { useRef, useState } from 'react';

// Reusable Card for Chart Sections
const ChartCard = ({ title, subtitle, children, className = "" }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col ${className}`}>
        <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex-1 flex justify-center items-center w-full min-h-[200px]">
            {children}
        </div>
    </div>
);

// 1. Vertical Bar Chart (Customer Perbulan)
const CustomerBarChart = ({ data = [], isLoading }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const maxValue = Math.max(1, ...data);
    const normalized = data.map((value) => value / maxValue);

    return (
        <div className="w-full h-64 flex items-end justify-between gap-2 pl-8 pb-6 relative border-b border-l border-gray-200">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-gray-400 py-1">
                <span>{maxValue}</span>
                <span>{Math.round(maxValue * 0.8)}</span>
                <span>{Math.round(maxValue * 0.6)}</span>
                <span>{Math.round(maxValue * 0.4)}</span>
                <span>{Math.round(maxValue * 0.2)}</span>
                <span>0</span>
            </div>

            {months.map((m, i) => (
                <div key={m} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                    <div
                        className="w-full max-w-[24px] bg-primary rounded-t-sm transition-all duration-500 hover:bg-primary-dark"
                        style={{ height: `${(normalized[i] || 0) * 100}%` }}
                    ></div>
                    <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-black/70 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                        {m}: {data[i] || 0}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-2 rotate-0 text-center">{m}</span>
                </div>
            ))}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                    loading...
                </div>
            )}
        </div>
    );
};

// 2. Horizontal Bar Chart (Produk Terlaris)
const ProductHorizontalChart = ({ data = [], isLoading }) => {
    const maxValue = Math.max(1, ...data.map((item) => item.value || 0));

    return (
        <div className="w-full flex flex-col gap-6">
            {data.length === 0 && !isLoading && (
                <div className="text-sm text-gray-400 text-center">Belum ada data produk.</div>
            )}
            {data.map((p) => (
                <div key={p.name} className="flex items-center gap-4 text-xs group relative">
                    <span className="w-24 text-right text-gray-500">{p.name}</span>
                    <div className="flex-1 h-5 bg-gray-50 rounded-r-md relative">
                        <div
                            className="bg-primary h-full rounded-r-md flex items-center justify-end px-2 text-white text-[10px]"
                            style={{ width: `${(p.value / maxValue) * 100}%` }}
                        >
                        </div>
                    </div>
                    <span className="w-12 text-gray-400">{p.value.toLocaleString()}</span>
                    <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-black/70 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                        {p.name}: {p.value.toLocaleString()}
                    </div>
                </div>
            ))}
            {/* X-Axis Scale */}
            {data.length > 0 && (
                <div className="flex justify-between pl-28 pr-12 text-[10px] text-gray-400">
                    <span>0</span>
                    <span>{Math.round(maxValue * 0.25)}</span>
                    <span>{Math.round(maxValue * 0.5)}</span>
                    <span>{Math.round(maxValue * 0.75)}</span>
                    <span>{maxValue}</span>
                </div>
            )}
            {isLoading && (
                <div className="text-center text-sm text-gray-400">loading...</div>
            )}
        </div>
    );
};

// 3. Pie Chart (Reservasi Treatment) - Pure CSS Conic Gradient
const ReservationPieChart = ({ data = [], isLoading }) => {
    const colors = ['#68d391', '#48bb78', '#2f855a', '#006400', '#7ccf8a', '#3aa655'];
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
    const [tooltip, setTooltip] = useState(null);
    const containerRef = useRef(null);

    return (
        <>
            <div ref={containerRef} className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="30" />
                    {data.map((seg, index) => {
                        const value = seg.value || 0;
                        const percent = total > 0 ? value / total : 0;
                        const dash = percent * circumference;
                        const gap = circumference - dash;
                        const strokeDasharray = `${dash} ${gap}`;
                        const strokeDashoffset = -offset;
                        offset += dash;
                        return (
                            <circle
                                key={`${seg.label}-${index}`}
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                stroke={colors[index % colors.length]}
                                strokeWidth="30"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                transform="rotate(-90 100 100)"
                                onMouseEnter={(e) => {
                                    if (!containerRef.current) return;
                                    const rect = containerRef.current.getBoundingClientRect();
                                    setTooltip({
                                        x: e.clientX - rect.left,
                                        y: e.clientY - rect.top,
                                        label: seg.label,
                                        value
                                    });
                                }}
                                onMouseMove={(e) => {
                                    if (!containerRef.current) return;
                                    const rect = containerRef.current.getBoundingClientRect();
                                    setTooltip((prev) =>
                                        prev
                                            ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top }
                                            : prev
                                    );
                                }}
                                onMouseLeave={() => setTooltip(null)}
                            />
                        );
                    })}
                </svg>

                {total === 0 && !isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                        Belum ada data.
                    </div>
                )}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                        loading...
                    </div>
                )}
                {tooltip && (
                    <div
                        className="pointer-events-none absolute rounded bg-black/80 px-2 py-1 text-[10px] text-white"
                        style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -120%)' }}
                    >
                        {tooltip.label}: {tooltip.value}
                    </div>
                )}
            </div>
            {data.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-gray-600">
                    {data.map((item, index) => (
                        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span>
                                {item.label} ({item.value})
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

// 4. Line Chart (Grafik Penjualan) - SVG Polyline
const SalesLineChart = ({ data = [], isLoading }) => {
    const maxValue = Math.max(1, ...data);
    const height = 100;
    const width = 240;
    const step = data.length > 1 ? width / (data.length - 1) : width;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [tooltip, setTooltip] = useState(null);
    const points = data.map((value, index) => {
        const x = index * step;
        const y = height - (value / maxValue) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full flex flex-col h-full">
            <div className="flex-1 w-full relative">
                <svg viewBox="0 0 250 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Horizontal Grid Lines */}
                    {[20, 40, 60, 80, 100].map(y => (
                        <line key={y} x1="0" y1={y} x2="250" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                    ))}

                    {/* The Chart Line */}
                    {data.length > 0 && (
                        <polyline
                            points={points}
                            fill="none"
                            stroke="#008000"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}
                </svg>
                {data.length > 0 && (
                    <div className="absolute inset-0">
                        {data.map((value, index) => {
                            const x = (index * step / 250) * 100;
                            const y = ((height - (value / maxValue) * height) / 120) * 100;
                            return (
                                <div
                                    key={`${index}-${value}`}
                                    className="absolute"
                                    style={{ left: `${x}%`, top: `${y}%` }}
                                    onMouseEnter={() => {
                                        setTooltip({
                                            x: `${x}%`,
                                            y: `${y}%`,
                                            label: months[index] || `Bulan ${index + 1}`,
                                            value
                                        });
                                    }}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <div className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#008000]" />
                                </div>
                            );
                        })}
                        {tooltip && (
                            <div
                                className="pointer-events-none absolute rounded bg-black/80 px-2 py-1 text-[10px] text-white"
                                style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -140%)' }}
                            >
                                {tooltip.label}: {tooltip.value.toLocaleString()}
                            </div>
                        )}
                    </div>
                )}
                {data.length === 0 && !isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                        Belum ada data.
                    </div>
                )}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                        loading...
                    </div>
                )}
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center gap-2 mt-4">
                {['1M', '3M', '6M', '1Y', 'ALL'].map((label, idx) => (
                    <button
                        key={label}
                        className={`px-3 py-1 text-[10px] rounded-full font-medium ${idx === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const DashboardCharts = ({ isLoading = false, customerMonthly = [], topProducts = [], reservationByTreatment = [], salesMonthly = [] }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <ChartCard title="Grafik Customer Perbulan" subtitle="Keterangan Dari Customer Perbulan">
                <CustomerBarChart data={customerMonthly} isLoading={isLoading} />
            </ChartCard>

            <ChartCard title="Produk Terlaris" subtitle="produk dengan penjualan tertinggi">
                <ProductHorizontalChart data={topProducts} isLoading={isLoading} />
            </ChartCard>

            <ChartCard title="Reservasi Treatment" subtitle="treatment yang paling banyak diminati">
                <ReservationPieChart data={reservationByTreatment} isLoading={isLoading} />
            </ChartCard>

            <ChartCard title="Grafik Penjualan Perbulan" subtitle="Melihat Pertumbuhan Bisnis">
                <SalesLineChart data={salesMonthly} isLoading={isLoading} />
            </ChartCard>
        </div>
    );
};

export default DashboardCharts;
