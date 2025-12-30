import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RevenueChart from "../../../../components/Dashboard/RevenueChart/RevenueChart";
import SalesList from "../../../../components/Dashboard/SalesList/SalesList";
import SellersList from "../../../../components/Dashboard/SellersList/SellersList";
import StatLineCard from "../../../../components/common/StatLineCard/StatLineCard";
import { DashboardService } from "../../../../services/dashboard.service";
import type {
  RevenueData,
  TopProduct,
  TopCustomer,
  OrderStats
} from "../../../../services/dashboard.service";

export default function Dashboard() {
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const [revenue, products, customers, orders] = await Promise.all([
          DashboardService.fetchRevenue({ signal: controller.signal }),
          DashboardService.fetchTopProducts({ signal: controller.signal }),
          DashboardService.fetchTopCustomers({ signal: controller.signal }),
          DashboardService.fetchOrderStats({ signal: controller.signal })
        ]);
        setRevenueData(revenue);
        setTopProducts(products);
        setTopCustomers(customers);
        setOrderStats(orders);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const handleGoToReport = () => {
    navigate("/manager/report");
  };

  if (loading) {
    return (
      <div className="space-y-5 mt-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Dashboard</h2>
        </div>
        <div className="text-center py-8 text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !revenueData) {
    return (
      <div className="space-y-5 mt-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Dashboard</h2>
        </div>
        <div className="text-center py-8 text-red-500">Error: {error || "Failed to load data"}</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 mt-3">
      {/* Hàng tiêu đề + nút */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Dashboard</h2>
      </div>

      {/* Revenue Card */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg">Revenue</h3>
        <p className="text-2xl font-bold mt-1">
          {revenueData.totalRevenue.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
        </p>
        <span
          className={`text-sm ${
            revenueData.percentChange >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {revenueData.percentChange >= 0 ? "↑" : "↓"} {Math.abs(revenueData.percentChange)}% vs
          last week
        </span>

        <div className="mt-4">
          <RevenueChart
            thisWeekData={revenueData.thisWeekData}
            lastWeekData={revenueData.lastWeekData}
          />
        </div>
      </section>

      {/* Bottom section */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <SalesList products={topProducts} />
        <SellersList customers={topCustomers} />
        <StatLineCard
          title="Order Bills"
          data={orderStats}
          currentKey="thisWeek"
          lastKey="lastWeek"
        />
      </section>
    </div>
  );
}
