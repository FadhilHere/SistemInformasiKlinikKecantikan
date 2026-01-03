import React from 'react';

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
const CustomerBarChart = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Mock data based on design: Feb is high, others are empty/low
    const data = [0.1, 1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    return (
        <div className="w-full h-64 flex items-end justify-between gap-2 pl-8 pb-6 relative border-b border-l border-gray-200">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-gray-400 py-1">
                <span>1</span>
                <span>0.8</span>
                <span>0.6</span>
                <span>0.4</span>
                <span>0.2</span>
                <span>0</span>
            </div>

            {months.map((m, i) => (
                <div key={m} className="flex-1 flex flex-col justify-end items-center h-full group">
                    <div
                        className="w-full max-w-[24px] bg-primary rounded-t-sm transition-all duration-500 hover:bg-primary-dark"
                        style={{ height: `${data[i] * 100}%` }}
                    ></div>
                    <span className="text-[10px] text-gray-400 mt-2 rotate-0 text-center">{m}</span>
                </div>
            ))}
        </div>
    );
};

// 2. Horizontal Bar Chart (Produk Terlaris)
const ProductHorizontalChart = () => {
    const products = [
        { name: 'Acne', value: 56635, max: 80000 },
        { name: 'Whitening', value: 74779, max: 80000 },
        { name: 'Anti - Aging', value: 19027, max: 80000 },
        { name: 'Flimming', value: 43887, max: 80000 },
        { name: 'Serum', value: 8142, max: 80000 },
    ];

    return (
        <div className="w-full flex flex-col gap-6">
            {products.map((p) => (
                <div key={p.name} className="flex items-center gap-4 text-xs">
                    <span className="w-20 text-right text-gray-500">{p.name}</span>
                    <div className="flex-1 h-5 bg-gray-50 rounded-r-md relative">
                        <div
                            className="bg-primary h-full rounded-r-md flex items-center justify-end px-2 text-white text-[10px]"
                            style={{ width: `${(p.value / p.max) * 100}%` }}
                        >
                        </div>
                    </div>
                    <span className="w-12 text-gray-400">{p.value.toLocaleString()}</span>
                </div>
            ))}
            {/* X-Axis Scale */}
            <div className="flex justify-between pl-24 pr-12 text-[10px] text-gray-400">
                <span>0</span>
                <span>20K</span>
                <span>40K</span>
                <span>60K</span>
                <span>80K</span>
            </div>
        </div>
    );
};

// 3. Pie Chart (Reservasi Treatment) - Pure CSS Conic Gradient
const ReservationPieChart = () => {
    // Segments based on visual check of design
    const segments = [
        { label: 'Bopeng', color: '#68d391', percent: 35, start: 0 },   // Light Green
        { label: 'Bopeng', color: '#48bb78', percent: 25, start: 35 },   // Med Green
        { label: 'Bopeng', color: '#2f855a', percent: 20, start: 60 },   // Dark Green
        { label: 'Bopeng', color: '#006400', percent: 20, start: 80 },   // Darker Green
    ];

    // Build conic gradient string
    // format: color start% end%, color start% end%, ...
    let gradientParts = [];
    let currentPos = 0;
    segments.forEach(seg => {
        gradientParts.push(`${seg.color} ${currentPos}% ${currentPos + seg.percent}%`);
        currentPos += seg.percent;
    });

    return (
        <div className="relative w-64 h-64">
            <div
                className="w-full h-full rounded-full"
                style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}
            ></div>

            {/* Labels overlay - manual positioning to mimic design labels inside slices */}
            <div className="absolute inset-0 pointer-events-none text-white text-xs font-medium">
                <div className="absolute top-[20%] left-[30%] -rotate-45">Bopeng</div>
                <div className="absolute top-[40%] right-[20%] rotate-12">Bopeng</div>
                <div className="absolute bottom-[25%] right-[30%] rotate-45">Bopeng</div>
                <div className="absolute bottom-[20%] left-[25%] -rotate-45">Bopeng</div>
            </div>
        </div>
    );
};

// 4. Line Chart (Grafik Penjualan) - SVG Polyline
const SalesLineChart = () => {
    // Smooth curve approximation
    const points = [
        [0, 80], [10, 85], [20, 70], [30, 90], [40, 40], [50, 60], [60, 50], [70, 40], [80, 70],
        [90, 85], [100, 75], [110, 70], [120, 60], [130, 40], [140, 20]
    ];

    // Normalize points to SVG coordinate space roughly 0-100
    // Visual trace: Starts mid-low, goes up and down multiple times
    // Using a simpler path for demo
    const pathData = "M0,100 C20,100 30,80 40,90 S60,40 70,50 S90,60 100,40 S120,70 130,80 S150,90 160,85 S180,80 190,60 S210,30 220,50 S240,40 250,10";

    return (
        <div className="w-full flex flex-col h-full">
            <div className="flex-1 w-full relative">
                <svg viewBox="0 0 250 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Horizontal Grid Lines */}
                    {[20, 40, 60, 80, 100].map(y => (
                        <line key={y} x1="0" y1={y} x2="250" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                    ))}

                    {/* The Chart Line */}
                    <path
                        d={pathData}
                        fill="none"
                        stroke="#008000"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
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

const DashboardCharts = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <ChartCard title="Grafik Customer Perbulan" subtitle="Keterangan Dari Customer Perbulan">
                <CustomerBarChart />
            </ChartCard>

            <ChartCard title="Produk Terlaris" subtitle="produk dengan penjualan tertinggi">
                <ProductHorizontalChart />
            </ChartCard>

            <ChartCard title="Reservasi Treatment" subtitle="treatment yang paling banyak diminati">
                <ReservationPieChart />
            </ChartCard>

            <ChartCard title="Grafik Penjualan Perbulan" subtitle="Melihat Pertumbuhan Bisnis">
                <SalesLineChart />
            </ChartCard>
        </div>
    );
};

export default DashboardCharts;
