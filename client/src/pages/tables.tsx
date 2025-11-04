import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/use-websocket";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Table, Order } from "@shared/schema";

interface TableWithOrder extends Table {
  orderStartTime?: string | null;
}

export default function TablesPage() {
  const [, navigate] = useLocation();
  useWebSocket();
  const [tablesWithOrders, setTablesWithOrders] = useState<TableWithOrder[]>([]);

  const { data: tables = [], isLoading } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  useEffect(() => {
    const enrichTables = tables.map((table) => {
      const tableOrder = orders.find((order) => order.id === table.currentOrderId);
      return {
        ...table,
        orderStartTime: tableOrder?.createdAt ? String(tableOrder.createdAt) : null,
      };
    });
    setTablesWithOrders(enrichTables);
  }, [tables, orders]);

  const markServedMutation = useMutation({
    mutationFn: async (tableId: string) => {
      const table = tablesWithOrders.find((t) => t.id === tableId);
      if (!table || !table.currentOrderId) return;

      const orderItemsRes = await fetch(`/api/orders/${table.currentOrderId}/items`);
      const orderItems = await orderItemsRes.json();

      await Promise.all(
        orderItems.map((item: any) =>
          apiRequest("PATCH", `/api/order-items/${item.id}/status`, { status: "served" })
        )
      );
    },
  });

  const handleTableClick = (id: string) => {
    const table = tablesWithOrders.find((t) => t.id === id);
    if (!table) return;

    if (table.status === "free") {
      navigate(`/billing?tableId=${table.id}&tableNumber=${table.tableNumber}&type=dine-in`);
    } else if (table.currentOrderId) {
      navigate(`/billing?tableId=${table.id}&tableNumber=${table.tableNumber}&orderId=${table.currentOrderId}&type=dine-in`);
    }
  };

  const handleToggleServed = async (tableId: string) => {
    await markServedMutation.mutateAsync(tableId);
  };

  const statusCounts = {
    free: tablesWithOrders.filter((t) => t.status === "free").length,
    occupied: tablesWithOrders.filter((t) => t.status === "occupied").length,
    preparing: tablesWithOrders.filter((t) => t.status === "preparing").length,
    ready: tablesWithOrders.filter((t) => t.status === "ready").length,
    reserved: tablesWithOrders.filter((t) => t.status === "reserved").length,
    served: tablesWithOrders.filter((t) => t.status === "served").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "free": return "bg-gray-300";
      case "occupied": return "bg-[#ff2400]";
      case "preparing": return "bg-[#fff500]";
      case "ready": return "bg-[#3acd32]";
      case "served": return "bg-[#3acd32]";
      case "reserved": return "bg-[#0075ff]";
      default: return "bg-gray-300";
    }
  };

  const getTableStatus = (table: Table): "free" | "occupied" | "preparing" | "ready" | "reserved" | "served" => {
    return table.status as "free" | "occupied" | "preparing" | "ready" | "reserved" | "served";
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader title="Table Management" showSearch={false} />

      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white border border-white shadow-md ring-1 ring-gray-200"></div>
              <span className="text-sm">
                Free <Badge variant="secondary">{statusCounts.free}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff2400]"></div>
              <span className="text-sm">
                Occupied <Badge variant="secondary">{statusCounts.occupied}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#fff500]"></div>
              <span className="text-sm">
                Preparing <Badge variant="secondary">{statusCounts.preparing}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3acd32]"></div>
              <span className="text-sm">
                Ready <Badge variant="secondary">{statusCounts.ready}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0075ff]"></div>
              <span className="text-sm">
                Reserved <Badge variant="secondary">{statusCounts.reserved}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#9b30ff]"></div>
              <span className="text-sm">
                Served <Badge variant="secondary">{statusCounts.served}</Badge>
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/billing?type=delivery")}
              data-testid="button-delivery-order"
            >
              <Plus className="h-4 w-4 mr-2" />
              Delivery Order
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Floor 1 - Main Dining</h2>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading tables...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {tablesWithOrders.map((table) => (
              <TableCard
                key={table.id}
                id={table.id}
                tableNumber={table.tableNumber}
                status={getTableStatus(table)}
                seats={table.seats}
                orderStartTime={table.orderStartTime}
                onClick={handleTableClick}
                onToggleServed={handleToggleServed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
