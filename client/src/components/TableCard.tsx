import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableCardProps {
  id: string;
  tableNumber: string;
  status: "free" | "occupied" | "preparing" | "ready" | "reserved" | "served";
  seats: number;
  currentGuests?: number;
  onClick: (id: string) => void;
}

const statusConfig = {
  free: {
    borderColor: "border-gray-300",
    circleColor: "bg-white border-gray-300",
    label: "Available",
  },
  occupied: {
    borderColor: "border-[#ff2400]",
    circleColor: "bg-[#ff2400]",
    label: "Occupied",
  },
  preparing: {
    borderColor: "border-[#fff500]",
    circleColor: "bg-[#fff500]",
    label: "Preparing",
  },
  ready: {
    borderColor: "border-[#3acd32]",
    circleColor: "bg-[#3acd32]",
    label: "Ready",
  },
  reserved: {
    borderColor: "border-[#0075ff]",
    circleColor: "bg-[#0075ff]",
    label: "Reserved",
  },
  served: {
    borderColor: "border-[#3acd32]",
    circleColor: "bg-[#3acd32]",
    label: "Served",
  },
};

export default function TableCard({
  id,
  tableNumber,
  status,
  seats,
  currentGuests,
  onClick,
}: TableCardProps) {
  const config = statusConfig[status];
  
  return (
    <button
      onClick={() => onClick(id)}
      data-testid={`table-${id}`}
      className={cn(
        "p-4 rounded-lg border-2 bg-white transition-all hover:shadow-lg active:scale-95 min-w-32",
        config.borderColor
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className={cn(
          "w-16 h-16 rounded-full border-2 flex items-center justify-center",
          config.circleColor,
          config.borderColor
        )}>
          <span className="text-2xl font-semibold text-black">{tableNumber}</span>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase text-black">{config.label}</p>
          <div className="flex items-center gap-1 justify-center mt-1 text-xs text-black">
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