import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketChart } from "@/State/Coin/Action";
import { Button } from "@/components/ui/button";

const StockChart = ({ coinId }) => {
  const dispatch = useDispatch();
  const { marketChart, loading } = useSelector((state) => state.coin);
  const [days, setDays] = useState(1);

  const timeButtons = [
    { label: "1D", value: 1 },
    { label: "1W", value: 7 },
    { label: "1M", value: 30 },
    { label: "1Y", value: 365 },
  ];

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (coinId) {
      dispatch(fetchMarketChart({ coinId, days, jwt }));
    }
  }, [dispatch, coinId, days]);

  // Robust Data Extraction
  const getPrices = () => {
      if (!marketChart) return [];
      if (marketChart.data && Array.isArray(marketChart.data)) return marketChart.data;
      if (marketChart.data && marketChart.data.prices && Array.isArray(marketChart.data.prices)) return marketChart.data.prices;
      if (marketChart.prices && Array.isArray(marketChart.prices)) return marketChart.prices;
      return [];
  };

  const prices = getPrices();

  const series = [{
      name: "Price",
      data: prices.map((item) => ({ x: new Date(item[0]), y: item[1] })),
  }];

  // --- UI MATCHING OPTIONS (SLATE THEME) ---
  const options = {
    chart: {
      type: "area",
      height: 450,
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      fontFamily: "inherit",
    },
    theme: { mode: "dark" },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.0,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      tooltip: { enabled: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false },
    },
    yaxis: {
      show: true,
      labels: {
        style: { colors: "#64748b", fontSize: "12px" }, // Slate-500
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
    grid: {
      borderColor: "#1e293b", // Slate-800
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    colors: ["#cbd5e1"], 
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" },
      x: { format: "dd MMM HH:mm" },
    },
  };

  // --- LOADING STATE ---
  if (loading || prices.length === 0) {
    return (
      <div className="h-[450px] w-full flex flex-col items-center justify-center border border-slate-800 rounded-lg bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mb-4"></div>
        <p className="text-slate-500 text-sm">{loading ? "Loading Chart..." : "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* Buttons - Moved to Top */}
      <div className="flex justify-center md:justify-start gap-4">
        {timeButtons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => setDays(btn.value)}
            className={`
              text-sm font-medium transition-all px-4 py-1.5 rounded-md border
              ${days === btn.value 
                ? "text-white bg-slate-800 border-slate-700" // Active: Slate Dark
                : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900"} // Inactive
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="w-full h-[450px] -ml-2"> 
        <ReactApexChart options={options} series={series} type="area" height="100%" />
      </div>

    </div>
  );
};

export default StockChart;