import { useState } from "react";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  available: boolean;
  variants?: string[];
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([
    { id: "1", name: "Chicken Burger", category: "Burgers", price: 199, cost: 80, available: true, variants: ["Regular", "Large"] },
    { id: "2", name: "Veggie Pizza", category: "Pizza", price: 299, cost: 120, available: true },
    { id: "3", name: "French Fries", category: "Fast Food", price: 99, cost: 35, available: true, variants: ["Small", "Medium", "Large"] },
    { id: "4", name: "Coca Cola", category: "Beverages", price: 50, cost: 20, available: true },
    { id: "5", name: "Caesar Salad", category: "Salads", price: 149, cost: 60, available: true },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["All", "Burgers", "Pizza", "Fast Food", "Beverages", "Salads", "Desserts"];

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category.toLowerCase() === selectedCategory);

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Menu Management" />

      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat.toLowerCase() ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.toLowerCase())}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="button-add-item">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input placeholder="Item Name" data-testid="input-item-name" />
                  <Select>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="burgers">Burgers</SelectItem>
                      <SelectItem value="pizza">Pizza</SelectItem>
                      <SelectItem value="fast-food">Fast Food</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Price" data-testid="input-price" />
                  <Input type="number" placeholder="Cost" data-testid="input-cost" />
                  <Button className="w-full" data-testid="button-save-item">Save Item</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-card rounded-lg border border-card-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Cost</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Margin</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const margin = ((item.price - item.cost) / item.price * 100).toFixed(1);
                return (
                  <tr key={item.id} className="border-b border-border last:border-0 hover-elevate">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.variants && (
                          <p className="text-xs text-muted-foreground">
                            Variants: {item.variants.join(", ")}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4 text-right font-semibold">₹{item.price}</td>
                    <td className="py-3 px-4 text-right">₹{item.cost}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="secondary">{margin}%</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}