import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import TableCard from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { Plus, User, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Table {
  id: string;
  tableNumber: string;
  status: "available" | "occupied" | "reserved" | "billed";
  seats: number;
  currentGuests?: number;
  bookedBy?: string;
  bookingTime?: string;
  leaveTime?: string;
  orderAmount?: number;
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([
    { id: "1", tableNumber: "T1", status: "available", seats: 4 },
    { 
      id: "2", 
      tableNumber: "T2", 
      status: "occupied", 
      seats: 6, 
      currentGuests: 4,
      bookedBy: "John Smith",
      bookingTime: "6:30 PM",
      leaveTime: "8:30 PM",
      orderAmount: 1250
    },
    { 
      id: "3", 
      tableNumber: "T3", 
      status: "reserved", 
      seats: 4,
      bookedBy: "Sarah Johnson",
      bookingTime: "7:00 PM",
      leaveTime: "9:00 PM"
    },
    { 
      id: "4", 
      tableNumber: "T4", 
      status: "billed", 
      seats: 2, 
      currentGuests: 2,
      bookedBy: "Mike Brown",
      bookingTime: "5:45 PM",
      leaveTime: "7:15 PM",
      orderAmount: 680
    },
    { id: "5", tableNumber: "T5", status: "available", seats: 8 },
    { 
      id: "6", 
      tableNumber: "T6", 
      status: "occupied", 
      seats: 4, 
      currentGuests: 3,
      bookedBy: "Emily Davis",
      bookingTime: "6:15 PM",
      leaveTime: "8:15 PM",
      orderAmount: 950
    },
    { id: "7", tableNumber: "T7", status: "available", seats: 2 },
    { 
      id: "8", 
      tableNumber: "T8", 
      status: "reserved", 
      seats: 6,
      bookedBy: "Robert Wilson",
      bookingTime: "7:30 PM",
      leaveTime: "9:30 PM"
    },
    { id: "9", tableNumber: "T9", status: "available", seats: 4 },
    { 
      id: "10", 
      tableNumber: "T10", 
      status: "occupied", 
      seats: 4, 
      currentGuests: 4,
      bookedBy: "Jessica Lee",
      bookingTime: "6:00 PM",
      leaveTime: "8:00 PM",
      orderAmount: 1420
    },
    { id: "11", tableNumber: "T11", status: "available", seats: 2 },
    { 
      id: "12", 
      tableNumber: "T12", 
      status: "billed", 
      seats: 4, 
      currentGuests: 3,
      bookedBy: "David Martinez",
      bookingTime: "5:30 PM",
      leaveTime: "7:00 PM",
      orderAmount: 890
    },
  ]);

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const handleTableClick = (id: string) => {
    const table = tables.find(t => t.id === id);
    if (table) {
      setSelectedTable(table);
    }
  };

  const statusCounts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    billed: tables.filter((t) => t.status === "billed").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-success";
      case "occupied": return "bg-danger";
      case "reserved": return "bg-primary";
      case "billed": return "bg-warning";
      default: return "bg-muted";
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
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

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Floor 1 - Main Dining</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {tables.map((table) => (
            <TableCard key={table.id} {...table} onClick={handleTableClick} />
          ))}
        </div>
      </div>

      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Table {selectedTable?.tableNumber}
              <Badge className={`${selectedTable?.status === "available" ? "bg-success" : selectedTable?.status === "occupied" ? "bg-danger" : selectedTable?.status === "reserved" ? "bg-primary" : "bg-warning"} text-white`}>
                {selectedTable?.status}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedTable?.seats} seats - {selectedTable?.currentGuests || 0} guests
            </DialogDescription>
          </DialogHeader>

          {selectedTable && selectedTable.status !== "available" ? (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusColor(selectedTable.status)} bg-opacity-20`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booked By</p>
                    <p className="font-semibold">{selectedTable.bookedBy || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusColor(selectedTable.status)} bg-opacity-20`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Time</p>
                    <p className="font-semibold">{selectedTable.bookingTime || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusColor(selectedTable.status)} bg-opacity-20`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Leave Time</p>
                    <p className="font-semibold">{selectedTable.leaveTime || "N/A"}</p>
                  </div>
                </div>

                {selectedTable.orderAmount && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-muted-foreground">Order Amount</span>
                      <span className="text-lg font-bold text-primary">₹{selectedTable.orderAmount}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {selectedTable.status === "occupied" && (
                  <Button className="flex-1" data-testid="button-view-order">
                    View Order
                  </Button>
                )}
                {selectedTable.status === "billed" && (
                  <Button className="flex-1" data-testid="button-settle-payment">
                    Settle Payment
                  </Button>
                )}
                {selectedTable.status === "reserved" && (
                  <Button className="flex-1" data-testid="button-cancel-reservation">
                    Cancel Reservation
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedTable(null)} className="flex-1" data-testid="button-close-details">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground py-4">
                This table is currently available
              </p>
              <div className="flex gap-2">
                <Button className="flex-1" data-testid="button-assign-table">
                  Assign to Order
                </Button>
                <Button variant="outline" onClick={() => setSelectedTable(null)} className="flex-1" data-testid="button-close-available">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}