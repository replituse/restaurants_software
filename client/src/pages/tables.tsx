import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Table } from "@shared/schema";

export default function TablesPage() {
  const [, navigate] = useLocation();

  const { data: tables = [], isLoading } = useQuery<Table[]>({
    queryKey: ["/api/tables"],
  });

  const handleTableClick = (id: string) => {
    const table = tables.find(t => t.id === id);
    if (!table) return;

    if (table.status === "free") {
      navigate(`/billing?tableId=${table.id}&tableNumber=${table.tableNumber}&type=dine-in`);
    } else if (table.currentOrderId) {
      navigate(`/billing?tableId=${table.id}&tableNumber=${table.tableNumber}&orderId=${table.currentOrderId}&type=dine-in`);
    }
  };

  const statusCounts = {
    free: tables.filter((t) => t.status === "free").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    preparing: tables.filter((t) => t.status === "preparing").length,
    ready: tables.filter((t) => t.status === "ready").length,
    served: tables.filter((t) => t.status === "served").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "free": return "bg-muted";
      case "occupied": return "bg-primary";
      case "preparing": return "bg-warning";
      case "ready": return "bg-success";
      case "served": return "bg-green-400";
      default: return "bg-muted";
    }
  };

  const getTableStatus = (table: Table): "available" | "occupied" | "reserved" | "billed" => {
    if (table.status === "free") return "available";
    if (table.status === "served") return "billed";
    if (table.status === "preparing" || table.status === "ready") return "reserved";
    return "occupied";
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader title="Table Management" showSearch={false} />

      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted border border-border"></div>
              <span className="text-sm">
                Free <Badge variant="secondary">{statusCounts.free}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm">
                Occupied <Badge variant="secondary">{statusCounts.occupied}</Badge>
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
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
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
            {tables.map((table) => (
              <TableCard
                key={table.id}
                id={table.id}
                tableNumber={table.tableNumber}
                status={getTableStatus(table)}
                seats={table.seats}
                onClick={handleTableClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
