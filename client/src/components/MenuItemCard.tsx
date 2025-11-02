import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MenuItemCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  available?: boolean;
  image?: string;
  onAdd: (id: string) => void;
}

export default function MenuItemCard({
  id,
  name,
  price,
  category,
  available = true,
  image,
  onAdd,
}: MenuItemCardProps) {
  return (
    <div
      className={`bg-card border border-card-border rounded-lg overflow-hidden hover-elevate transition-all ${
        !available ? "opacity-60" : ""
      }`}
      data-testid={`menu-item-${id}`}
    >
      <div className="aspect-video bg-muted relative">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {!available && (
          <Badge className="absolute top-2 right-2 bg-danger text-white">
            Out of Stock
          </Badge>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-card-foreground truncate" data-testid={`text-item-name-${id}`}>
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{category}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary" data-testid={`text-price-${id}`}>
            ₹{price.toFixed(2)}
          </span>
          <Button
            size="icon"
            variant="default"
            disabled={!available}
            onClick={() => onAdd(id)}
            data-testid={`button-add-${id}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}