import StatsCards from "./StatsCards";
import SalesChart from "./SalesChart";
import CategoryChart from "./CategoryChart";
import RecentOrders from "./RecentOrders";
import ProductsTable from "./ProductsTable";
import TopProducts from "./TopProducts";

export default function Dashboard() {
  return (
        <div className="space-y-2">
          <StatsCards />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SalesChart />
            </div>
            <CategoryChart />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductsTable />
            </div>
            <TopProducts />
          </div>

          <RecentOrders />
        </div>
  );
}
