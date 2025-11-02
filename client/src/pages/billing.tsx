import { useState } from "react";
import { Search } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import CategorySidebar from "@/components/CategorySidebar";
import MenuItemCard from "@/components/MenuItemCard";
import OrderCart from "@/components/OrderCart";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function BillingPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [serviceType, setServiceType] = useState<"dine-in" | "delivery" | "pickup">("dine-in");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Items" },
    { id: "fast-food", name: "Fast Food" },
    { id: "beverages", name: "Beverages" },
    { id: "burgers", name: "Burgers" },
    { id: "pizza", name: "Pizza" },
    { id: "desserts", name: "Desserts" },
    { id: "salads", name: "Salads" },
    { id: "appetizers", name: "Appetizers" },
  ];

  const menuItems: MenuItem[] = [
    { id: "1", name: "Chicken Burger", price: 199, category: "burgers", available: true },
    { id: "2", name: "Veggie Pizza", price: 299, category: "pizza", available: true },
    { id: "3", name: "French Fries", price: 99, category: "fast-food", available: true },
    { id: "4", name: "Coca Cola", price: 50, category: "beverages", available: true },
    { id: "5", name: "Caesar Salad", price: 149, category: "salads", available: true },
    { id: "6", name: "Chocolate Cake", price: 120, category: "desserts", available: false },
    { id: "7", name: "Margherita Pizza", price: 249, category: "pizza", available: true },
    { id: "8", name: "Chicken Wings", price: 179, category: "appetizers", available: true },
    { id: "9", name: "Pepsi", price: 50, category: "beverages", available: true },
    { id: "10", name: "Pasta Alfredo", price: 229, category: "fast-food", available: true },
    { id: "11", name: "Garlic Bread", price: 89, category: "appetizers", available: true },
    { id: "12", name: "Ice Cream", price: 80, category: "desserts", available: true },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = (itemId: string) => {
    const menuItem = menuItems.find((item) => item.id === itemId);
    if (!menuItem) return;

    const existingItem = orderItems.find((item) => item.id === itemId);
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
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

  const handleCheckout = () => {
    console.log("Checkout:", { serviceType, items: orderItems });
    alert("Order placed successfully!");
  };

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Restaurant POS" showSearch={false} />
      
      <div className="bg-muted/30 border-b border-border px-6 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-6">
            <span className="text-muted-foreground">
              Table: <span className="font-medium text-foreground">T-5</span>
            </span>
            <span className="text-muted-foreground">
              User: <span className="font-medium text-foreground">John Doe</span>
            </span>
          </div>
          <span className="text-muted-foreground">
            Date: <span className="font-medium text-foreground">{new Date().toLocaleDateString()}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-56 shrink-0">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
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

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} {...item} onAdd={handleAddItem} />
              ))}
            </div>
          </div>
        </div>

        <div className="w-96 shrink-0">
          <OrderCart
            items={orderItems}
            serviceType={serviceType}
            onServiceTypeChange={setServiceType}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}