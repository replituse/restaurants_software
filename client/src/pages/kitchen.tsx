import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import KDSOrderCard from "@/components/KDSOrderCard";
import { Badge } from "@/components/ui/badge";

interface KDSOrder {
  orderId: string;
  tableNumber: string;
  status: "new" | "preparing" | "ready";
  orderTime: Date;
  items: { name: string; quantity: number; ready: boolean }[];
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<KDSOrder[]>([
    {
      orderId: "001",
      tableNumber: "T5",
      status: "new",
      orderTime: new Date(Date.now() - 120000),
      items: [
        { name: "Chicken Burger", quantity: 2, ready: false },
        { name: "French Fries", quantity: 1, ready: false },
      ],
    },
    {
      orderId: "002",
      tableNumber: "T3",
      status: "preparing",
      orderTime: new Date(Date.now() - 300000),
      items: [
        { name: "Veggie Pizza", quantity: 1, ready: false },
        { name: "Coca Cola", quantity: 2, ready: true },
        { name: "Garlic Bread", quantity: 1, ready: false },
      ],
    },
    {
      orderId: "003",
      tableNumber: "T8",
      status: "new",
      orderTime: new Date(Date.now() - 60000),
      items: [
        { name: "Pasta Alfredo", quantity: 1, ready: false },
        { name: "Caesar Salad", quantity: 1, ready: false },
      ],
    },
    {
      orderId: "004",
      tableNumber: "T2",
      status: "preparing",
      orderTime: new Date(Date.now() - 420000),
      items: [
        { name: "Margherita Pizza", quantity: 2, ready: true },
        { name: "Chicken Wings", quantity: 1, ready: false },
      ],
    },
    {
      orderId: "005",
      tableNumber: "T10",
      status: "ready",
      orderTime: new Date(Date.now() - 600000),
      items: [
        { name: "Chocolate Cake", quantity: 2, ready: true },
        { name: "Ice Cream", quantity: 2, ready: true },
      ],
    },
  ]);

  const handleStatusChange = (orderId: string, newStatus: "new" | "preparing" | "ready") => {
    setOrders(
      orders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const statusCounts = {
    new: orders.filter((o) => o.status === "new").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader title="Kitchen Display System" showSearch={false} />

      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger"></div>
            <span className="text-sm">
              New <Badge variant="secondary">{statusCounts.new}</Badge>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-sm">
              Preparing <Badge variant="secondary">{statusCounts.preparing}</Badge>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-sm">
              Ready <Badge variant="secondary">{statusCounts.ready}</Badge>
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <KDSOrderCard
              key={order.orderId}
              {...order}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}