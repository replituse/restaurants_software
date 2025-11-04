import { useState, useEffect } from "react";
import { Search, Send } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import AppHeader from "@/components/AppHeader";
import CategorySidebar from "@/components/CategorySidebar";
import MenuItemCard from "@/components/MenuItemCard";
import OrderCart from "@/components/OrderCart";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MenuItem } from "@shared/schema";

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export default function BillingPage() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [serviceType, setServiceType] = useState<"dine-in" | "delivery" | "pickup">("dine-in");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">("cash");
  const [currentTableId, setCurrentTableId] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string>("");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableId = params.get("tableId");
    const tableNum = params.get("tableNumber");
    const orderId = params.get("orderId");
    const type = params.get("type") as "dine-in" | "delivery" | "pickup" | null;
    
    if (tableId && tableNum) {
      setCurrentTableId(tableId);
      setTableNumber(tableNum);
      setServiceType(type || "dine-in");
    } else if (type === "delivery") {
      setServiceType("delivery");
    }

    if (orderId) {
      setCurrentOrderId(orderId);
      fetchExistingOrder(orderId);
    }
  }, []);

  const fetchExistingOrder = async (orderId: string) => {
    try {
      const itemsRes = await fetch(`/api/orders/${orderId}/items`);
      const items = await itemsRes.json();
      
      const formattedItems = items.map((item: any) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        notes: item.notes || undefined,
      }));
      
      setOrderItems(formattedItems);
    } catch (error) {
      console.error("Failed to fetch existing order:", error);
      toast({
        title: "Error",
        description: "Failed to load existing order",
        variant: "destructive",
      });
    }
  };

  const { data: menuItems = [], isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: { tableId: string | null; orderType: string }) => {
      const res = await apiRequest("POST", "/api/orders", data);
      return await res.json();
    },
    onSuccess: (order: any) => {
      setCurrentOrderId(order.id);
    },
  });

  const addOrderItemMutation = useMutation({
    mutationFn: async (data: { orderId: string; item: any }) => {
      const res = await apiRequest("POST", `/api/orders/${data.orderId}/items`, data.item);
      return await res.json();
    },
  });

  const completeOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await apiRequest("POST", `/api/orders/${orderId}/complete`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/active"] });
    },
  });

  const categories = [
    { id: "all", name: "All Items" },
    { id: "Burgers", name: "Burgers" },
    { id: "Pizza", name: "Pizza" },
    { id: "Fast Food", name: "Fast Food" },
    { id: "Beverages", name: "Beverages" },
    { id: "Desserts", name: "Desserts" },
    { id: "Salads", name: "Salads" },
    { id: "Pasta", name: "Pasta" },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const handleAddItem = (itemId: string) => {
    const menuItem = menuItems.find((item) => item.id === itemId);
    if (!menuItem) return;

    const existingItem = orderItems.find((item) => item.menuItemId === itemId);
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.menuItemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: Math.random().toString(36).substring(7),
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: parseFloat(menuItem.price),
          quantity: 1,
          notes: undefined,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setOrderItems(orderItems.filter((item) => item.id !== id));
    } else {
      setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, notes } : item)));
  };

  const handleSendKOT = async () => {
    if (orderItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items before sending to kitchen",
        variant: "destructive",
      });
      return;
    }

    try {
      let orderId = currentOrderId;

      if (!orderId) {
        const order = await createOrderMutation.mutateAsync({
          tableId: currentTableId,
          orderType: serviceType,
        });
        orderId = order.id;
      }

      for (const item of orderItems) {
        await addOrderItemMutation.mutateAsync({
          orderId: orderId!,
          item: {
            orderId: orderId!,
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            price: item.price.toFixed(2),
            notes: item.notes || null,
            status: "new",
          },
        });
      }

      toast({
        title: "KOT Sent!",
        description: "Order sent to kitchen successfully",
      });

      if (serviceType === "delivery") {
        setShowCheckoutDialog(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send order to kitchen",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (orderItems.length === 0 && !currentOrderId) {
      toast({
        title: "No order",
        description: "Please add items or send KOT first",
        variant: "destructive",
      });
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handleConfirmCheckout = async () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    if (!currentOrderId) {
      toast({
        title: "Error",
        description: "Please send KOT before billing",
        variant: "destructive",
      });
      return;
    }

    try {
      await completeOrderMutation.mutateAsync(currentOrderId);

      toast({
        title: "Order completed!",
        description: `Total: ₹${total.toFixed(2)} - Payment: ${paymentMethod.toUpperCase()}`,
      });

      setOrderItems([]);
      setCurrentOrderId(null);
      setShowCheckoutDialog(false);

      if (currentTableId) {
        navigate("/tables");
      } else {
        setCurrentTableId(null);
        setTableNumber("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete order",
        variant: "destructive",
      });
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader title="Billing / POS" showSearch={false} />
      
      <div className="bg-muted/30 border-b border-border px-6 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-6">
            {tableNumber ? (
              <span className="text-muted-foreground">
                Table: <span className="font-medium text-foreground">{tableNumber}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">
                Mode: <span className="font-medium text-foreground capitalize">{serviceType}</span>
              </span>
            )}
            <span className="text-muted-foreground">
              User: <span className="font-medium text-foreground">Cashier</span>
            </span>
          </div>
          <span className="text-muted-foreground">
            Date: <span className="font-medium text-foreground">{new Date().toLocaleDateString()}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-48 lg:w-56 shrink-0 hidden md:block">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-menu-search"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {filteredItems.length} items found
              </span>
              {selectedCategory !== "all" && (
                <Badge variant="secondary">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            {menuLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading menu...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {filteredItems.map((item) => (
                  <MenuItemCard 
                    key={item.id} 
                    id={item.id}
                    name={item.name}
                    price={parseFloat(item.price)}
                    category={item.category}
                    available={item.available}
                    isVeg={item.isVeg}
                    onAdd={handleAddItem} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-96 shrink-0 md:block">
          <OrderCart
            items={orderItems}
            serviceType={serviceType}
            onServiceTypeChange={setServiceType}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onUpdateNotes={handleUpdateNotes}
            onCheckout={handleCheckout}
            onSendKOT={handleSendKOT}
            showKOTButton={!currentOrderId}
          />
        </div>
      </div>

      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Select payment method and complete the order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={paymentMethod === "cash" ? "default" : "outline"}
                onClick={() => setPaymentMethod("cash")}
                data-testid="button-payment-cash"
              >
                Cash
              </Button>
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                onClick={() => setPaymentMethod("card")}
                data-testid="button-payment-card"
              >
                Card
              </Button>
              <Button
                variant={paymentMethod === "upi" ? "default" : "outline"}
                onClick={() => setPaymentMethod("upi")}
                data-testid="button-payment-upi"
              >
                UPI
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCheckoutDialog(false)}
                className="flex-1"
                data-testid="button-cancel-checkout"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmCheckout}
                className="flex-1"
                data-testid="button-confirm-payment"
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
