import { Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface TableCardProps {
  id: string;
  tableNumber: string;
  status: "free" | "occupied" | "preparing" | "ready" | "reserved" | "served";
  seats: number;
  currentGuests?: number;
  orderStartTime?: string | null;
  onClick: (id: string) => void;
  onToggleServed?: (id: string) => void;
}

const statusConfig = {
  free: {
    borderColor: "border-white",
    circleColor: "bg-white",
    circleBorder: "border-white shadow-sm",
    label: "Free",
  },
  occupied: {
    borderColor: "border-[#ff2400]",
    circleColor: "bg-[#ff2400]",
    circleBorder: "border-[#ff2400]",
    label: "Occupied",
  },
  preparing: {
    borderColor: "border-[#fff500]",
    circleColor: "bg-[#fff500]",
    circleBorder: "border-[#fff500]",
    label: "Preparing",
  },
  ready: {
    borderColor: "border-[#3acd32]",
    circleColor: "bg-[#3acd32]",
    circleBorder: "border-[#3acd32]",
    label: "Ready",
  },
  reserved: {
    borderColor: "border-[#0075ff]",
    circleColor: "bg-[#0075ff]",
    circleBorder: "border-[#0075ff]",
    label: "Reserved",
  },
  served: {
    borderColor: "border-[#9b30ff]",
    circleColor: "bg-[#9b30ff]",
    circleBorder: "border-[#9b30ff]",
    label: "Served",
  },
};

export default function TableCard({
  id,
  tableNumber,
  status,
  seats,
  currentGuests,
  orderStartTime,
  onClick,
  onToggleServed,
}: TableCardProps) {
  const config = statusConfig[status];
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (!orderStartTime || (status !== "preparing" && status !== "ready")) {
      return;
    }

    const updateTime = () => {
      const startTime = new Date(orderStartTime).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [orderStartTime, status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (status === "ready" && onToggleServed) {
      e.stopPropagation();
    } else {
      onClick(id);
    }
  };

  const handleServedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleServed) {
      onToggleServed(id);
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={handleClick}
        data-testid={`table-${id}`}
        className={cn(
          "w-full p-4 rounded-lg border-2 bg-white transition-all hover:shadow-lg active:scale-95 min-w-32",
          status === "free" ? "border-white shadow-md" : config.borderColor
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "w-16 h-16 rounded-full border-2 flex items-center justify-center",
            config.circleColor,
            config.circleBorder
          )}>
            <span className="text-2xl font-semibold text-black">{tableNumber}</span>
          </div>
          <div className="text-center w-full">
            <p className="text-xs font-semibold uppercase text-black">{config.label}</p>
            <div className="flex items-center gap-1 justify-center mt-1 text-xs text-black">
              <Users className="h-3 w-3" />
              <span>
                {currentGuests || 0}/{seats}
              </span>
            </div>
            {(status === "preparing" || status === "ready") && orderStartTime && (
              <div className="flex items-center gap-1 justify-center mt-1 text-xs font-mono font-semibold text-black">
                <Clock className="h-3 w-3" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>
        </div>
      </button>
      {status === "ready" && onToggleServed && (
        <button
          onClick={handleServedClick}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#9b30ff] hover:bg-[#8a2be2] text-white text-xs px-3 py-1 rounded-full font-medium transition-colors z-10"
          data-testid={`toggle-served-${id}`}
        >
          Mark Served
        </button>
      )}
    </div>
  );
}