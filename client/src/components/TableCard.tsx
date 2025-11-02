import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableCardProps {
  id: string;
  tableNumber: string;
  status: "available" | "occupied" | "reserved" | "billed";
  seats: number;
  currentGuests?: number;
  onClick: (id: string) => void;
}

const statusColors = {
  available: "border-success bg-success/10 text-success",
  occupied: "border-danger bg-danger/10 text-danger",
  reserved: "border-primary bg-primary/10 text-primary",
  billed: "border-warning bg-warning/10 text-warning",
};

const statusLabels = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  billed: "Billed",
};

export default function TableCard({
  id,
  tableNumber,
  status,
  seats,
  currentGuests,
  onClick,
}: TableCardProps) {
  return (
    <button
      onClick={() => onClick(id)}
      data-testid={`table-${id}`}
      className={cn(
        "p-4 rounded-lg border-2 transition-all hover-elevate active-elevate-2 min-w-32",
        statusColors[status]
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center">
          <span className="text-2xl font-bold">{tableNumber}</span>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase">{statusLabels[status]}</p>
          <div className="flex items-center gap-1 justify-center mt-1 text-xs">
            <Users className="h-3 w-3" />
            <span>
              {currentGuests || 0}/{seats}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}