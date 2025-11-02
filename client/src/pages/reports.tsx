import { DollarSign, ShoppingCart, Users, TrendingUp, Calendar } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const salesData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 5000 },
  { name: "Thu", sales: 4500 },
  { name: "Fri", sales: 6000 },
  { name: "Sat", sales: 7500 },
  { name: "Sun", sales: 7000 },
];

const categoryData = [
  { name: "Burgers", value: 4500 },
  { name: "Pizza", value: 6200 },
  { name: "Beverages", value: 2100 },
  { name: "Desserts", value: 1800 },
  { name: "Salads", value: 1200 },
];

export default function ReportsPage() {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Reports & Analytics" showSearch={false} />

      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button variant="outline" size="sm">This Week</Button>
            <Button variant="outline" size="sm">This Month</Button>
            <Button variant="outline" size="sm">Custom Range</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export PDF</Button>
            <Button variant="outline" size="sm">Export Excel</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Sales"
            value="₹45,320"
            icon={DollarSign}
            color="green"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Total Orders"
            value={156}
            icon={ShoppingCart}
            color="blue"
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Customers"
            value={89}
            icon={Users}
            color="yellow"
            trend={{ value: 3.1, isPositive: false }}
          />
          <StatCard
            title="Growth"
            value="+18%"
            icon={TrendingUp}
            color="red"
            trend={{ value: 5.4, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-card-border p-6">
            <h3 className="font-semibold text-lg mb-4">Weekly Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="hsl(204 70% 53%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-lg border border-card-border p-6">
            <h3 className="font-semibold text-lg mb-4">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(145 63% 42%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 bg-card rounded-lg border border-card-border p-6">
          <h3 className="font-semibold text-lg mb-4">Top Selling Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Orders</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Veggie Pizza", category: "Pizza", orders: 45, revenue: 13455 },
                  { name: "Chicken Burger", category: "Burgers", orders: 38, revenue: 7562 },
                  { name: "French Fries", category: "Fast Food", orders: 52, revenue: 5148 },
                  { name: "Coca Cola", category: "Beverages", orders: 67, revenue: 3350 },
                  { name: "Caesar Salad", category: "Salads", orders: 23, revenue: 3427 },
                ].map((item, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover-elevate">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                    <td className="py-3 px-4 text-right">{item.orders}</td>
                    <td className="py-3 px-4 text-right font-semibold">₹{item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}