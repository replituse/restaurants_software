import { Minus, Plus, Trash2, User, Table, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderCartProps {
  items: OrderItem[];
  serviceType: "dine-in" | "delivery" | "pickup";
  onServiceTypeChange: (type: "dine-in" | "delivery" | "pickup") => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function OrderCart({
  items,
  serviceType,
  onServiceTypeChange,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: OrderCartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="h-full bg-card border-l border-card-border flex flex-col">
      <div className="p-4 border-b border-card-border">
        <h2 className="font-semibold text-card-foreground mb-3">Current Order</h2>
        <div className="flex gap-2">
          {(["dine-in", "delivery", "pickup"] as const).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={serviceType === type ? "default" : "outline"}
              onClick={() => onServiceTypeChange(type)}
              data-testid={`button-service-${type}`}
              className="flex-1 capitalize"
            >
              {type.replace("-", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-card-border">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" data-testid="button-table">
            <Table className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button size="sm" variant="outline" className="flex-1" data-testid="button-customer">
            <User className="h-4 w-4 mr-2" />
            Customer
          </Button>
          <Button size="sm" variant="outline" className="flex-1" data-testid="button-notes">
            <StickyNote className="h-4 w-4 mr-2" />
            Notes
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No items in cart</p>
            <p className="text-sm mt-2">Add items from the menu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-2" data-testid={`cart-item-${item.id}`}>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    data-testid={`button-decrease-${item.id}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.id}`}>
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    data-testid={`button-increase-${item.id}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => onRemoveItem(item.id)}
                  data-testid={`button-remove-${item.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-card-border bg-muted/30">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-card-foreground" data-testid="text-subtotal">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (5%)</span>
            <span className="text-card-foreground" data-testid="text-tax">₹{tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary text-lg" data-testid="text-total">₹{total.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" data-testid="button-save">
            Save
          </Button>
          <Button variant="outline" size="sm" data-testid="button-kot">
            KOT
          </Button>
        </div>
        <Button
          className="w-full mt-2"
          size="lg"
          disabled={items.length === 0}
          onClick={onCheckout}
          data-testid="button-checkout"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}