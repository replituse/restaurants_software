import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableWithOrder | null>(null);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);

  const { data: tables = [], isLoading } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  useEffect(() => {
    if (!tables.length) {
      setTablesWithOrders([]);
      return;
    }
    
    const enrichTables = tables.map((table) => {
      const tableOrder = orders.find((order) => order.id === table.currentOrderId);
      return {
        ...table,
        orderStartTime: tableOrder?.createdAt ? String(tableOrder.createdAt) : null,
      };
    });
    
    setTablesWithOrders(prevTables => {
      const hasChanged = JSON.stringify(prevTables) !== JSON.stringify(enrichTables);
      return hasChanged ? enrichTables : prevTables;
    });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/active"] });
    },
  });

  const handleTableClick = async (id: string) => {
    const table = tablesWithOrders.find((t) => t.id === id);
    if (!table) return;

    if (table.status === "free") {
      navigate(`/billing?tableId=${table.id}&tableNumber=${table.tableNumber}&type=dine-in`);
    } else if (table.currentOrderId) {
      setSelectedTable(table);
      
      try {
        const response = await fetch(`/api/orders/${table.currentOrderId}/items`);
        const items = await response.json();
        setOrderDetails(items);
      } catch (error) {
        setOrderDetails([]);
      }
      
      setShowOrderDialog(true);
    }
  };

  const handleToggleServed = async (tableId: string) => {
    await markServedMutation.mutateAsync(tableId);
  };

  const handleViewOrder = async (tableId: string) => {
    const table = tablesWithOrders.find((t) => t.id === tableId);
    if (!table) return;
    
    setSelectedTable(table);
    
    if (table.currentOrderId) {
      try {
        const response = await fetch(`/api/orders/${table.currentOrderId}/items`);
        const items = await response.json();
        setOrderDetails(items);
      } catch (error) {
        setOrderDetails([]);
      }
    } else {
      setOrderDetails([]);
    }
    
    setShowOrderDialog(true);
  };

  const handleBilling = (tableId: string) => {
    const table = tablesWithOrders.find((t) => t.id === tableId);
    if (!table) return;
    
    if (table.status === "free") {
      navigate(`/billing?tableId=${table.id}&tableNumber=${table.tableNumber}&type=dine-in`);
    } else if (table.currentOrderId) {
      navigate(`/billing?tableId=${table.id}&tableNumber=${table.tableNumber}&orderId=${table.currentOrderId}&type=dine-in`);
    }
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
      case "free": return "bg-white border border-black";
      case "occupied": return "bg-[#ff2400]";
      case "preparing": return "bg-[#fff500]";
      case "ready": return "bg-[#3acd32]";
      case "served": return "bg-[#8000ff]";
      case "reserved": return "bg-[#0075ff]";
      default: return "bg-white border border-black";
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
              <div className="w-4 h-4 rounded-full bg-white border-2 border-black shadow-sm"></div>
              <span className="text-sm font-medium">
                Available <Badge variant="secondary">{statusCounts.free}</Badge>
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
              <div className="w-3 h-3 rounded-full bg-[#8000ff]"></div>
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
                onViewOrder={handleViewOrder}
                onBilling={handleBilling}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details - Table {selectedTable?.tableNumber}</DialogTitle>
            <DialogDescription>
              {selectedTable?.status === "free" 
                ? "No active order" 
                : `Current order status: ${selectedTable?.status}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {orderDetails.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg font-medium">Empty</p>
                <p className="text-sm mt-1">No items in this order</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {orderDetails.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{(item.quantity * parseFloat(item.price)).toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'new' ? 'bg-red-100 text-red-700' :
                        item.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'ready' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">
                      ₹{orderDetails.reduce((sum, item) => 
                        sum + (item.quantity * parseFloat(item.price)), 0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
