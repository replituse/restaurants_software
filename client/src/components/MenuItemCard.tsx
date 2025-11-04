import { Badge } from "@/components/ui/badge";

interface MenuItemCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  available?: boolean;
  image?: string;
  isVeg?: boolean;
  onAdd: (id: string) => void;
}

export default function MenuItemCard({
  id,
  name,
  price,
  category,
  available = true,
  image,
  isVeg = true,
  onAdd,
}: MenuItemCardProps) {
  return (
    <div
      className={`bg-card border border-card-border rounded-lg overflow-hidden hover-elevate transition-all relative ${
        !available ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={() => available && onAdd(id)}
      data-testid={`menu-item-${id}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <div className="aspect-video bg-muted relative">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50"></div>
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
        </div>
      </div>
    </div>
  );
}