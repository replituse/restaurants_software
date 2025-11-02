import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Table {
  id: string;
  tableNumber: string;
  status: "available" | "occupied" | "reserved" | "billed";
  seats: number;
  currentGuests?: number;
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([
    { id: "1", tableNumber: "T1", status: "available", seats: 4 },
    { id: "2", tableNumber: "T2", status: "occupied", seats: 6, currentGuests: 4 },
    { id: "3", tableNumber: "T3", status: "reserved", seats: 4 },
    { id: "4", tableNumber: "T4", status: "billed", seats: 2, currentGuests: 2 },
    { id: "5", tableNumber: "T5", status: "available", seats: 8 },
    { id: "6", tableNumber: "T6", status: "occupied", seats: 4, currentGuests: 3 },
    { id: "7", tableNumber: "T7", status: "available", seats: 2 },
    { id: "8", tableNumber: "T8", status: "reserved", seats: 6 },
    { id: "9", tableNumber: "T9", status: "available", seats: 4 },
    { id: "10", tableNumber: "T10", status: "occupied", seats: 4, currentGuests: 4 },
    { id: "11", tableNumber: "T11", status: "available", seats: 2 },
    { id: "12", tableNumber: "T12", status: "billed", seats: 4, currentGuests: 3 },
  ]);

  const handleTableClick = (id: string) => {
    console.log("Table clicked:", id);
  };

  const statusCounts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    billed: tables.filter((t) => t.status === "billed").length,
  };

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Table Management" showSearch={false} />

      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-sm">
                Available <Badge variant="secondary">{statusCounts.available}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger"></div>
              <span className="text-sm">
                Occupied <Badge variant="secondary">{statusCounts.occupied}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm">
                Reserved <Badge variant="secondary">{statusCounts.reserved}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-sm">
                Billed <Badge variant="secondary">{statusCounts.billed}</Badge>
              </span>
            </div>
          </div>
          <Button data-testid="button-add-table">
            <Plus className="h-4 w-4 mr-2" />
            Add Table
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-lg font-semibold mb-4">Floor 1 - Main Dining</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map((table) => (
            <TableCard key={table.id} {...table} onClick={handleTableClick} />
          ))}
        </div>
      </div>
    </div>
  );
}