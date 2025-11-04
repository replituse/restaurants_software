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
      className={`bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary hover:scale-[1.02] active:scale-95 transition-all duration-200 relative ${
        !available ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={() => available && onAdd(id)}
      data-testid={`menu-item-${id}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <div className="p-4 relative">
        {!available && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white shadow-md">
            Out of Stock
          </Badge>
        )}
        <div className={`inline-block px-2 py-0.5 rounded-md mb-2 ${isVeg ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'} mx-auto`}></div>
        </div>
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2 min-h-[2.5rem]" data-testid={`text-item-name-${id}`}>
          {name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">{category}</p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-xl font-bold text-primary" data-testid={`text-price-${id}`}>
            ₹{price.toFixed(2)}
          </span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="text-lg font-bold">+</span>
          </div>
        </div>
      </div>
    </div>
  );
}