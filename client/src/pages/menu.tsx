import { useState } from "react";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MenuItem } from "@shared/schema";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const createMenuItemMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      price: string;
      cost: string;
      available: boolean;
    }) => {
      const res = await apiRequest("POST", "/api/menu", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: async ({  id, data }: { id: string; data: Partial<MenuItem> }) => {
      const res = await apiRequest("PATCH", `/api/menu/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/menu/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    },
  });

  const categories = ["All", "Burgers", "Pizza", "Fast Food", "Beverages", "Salads", "Desserts", "Pasta"];

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category.toLowerCase() === selectedCategory);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await createMenuItemMutation.mutateAsync({
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      cost: formData.get("cost") as string,
      available: true,
    });
  };

  const toggleAvailability = async (id: string, available: boolean) => {
    await updateMenuItemMutation.mutateAsync({
      id,
      data: { available: !available },
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Menu Management" />

      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat.toLowerCase() ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.toLowerCase())}
                data-testid={`button-category-${cat.toLowerCase()}`}
              >
                {cat}
              </Button>
            ))}
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <Input 
                  name="name"
                  placeholder="Item Name"
                  required
                  data-testid="input-item-name" 
                />
                <Select name="category" required>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== "All").map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  required
                  data-testid="input-price" 
                />
                <Input 
                  name="cost"
                  type="number"
                  step="0.01"
                  placeholder="Cost"
                  required
                  data-testid="input-cost" 
                />
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={createMenuItemMutation.isPending}
                  data-testid="button-save-item"
                >
                  {createMenuItemMutation.isPending ? "Adding..." : "Add Item"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading menu...</div>
        ) : (
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
                  const price = parseFloat(item.price);
                  const cost = parseFloat(item.cost);
                  const margin = ((price - cost) / price * 100).toFixed(1);
                  return (
                    <tr key={item.id} className="border-b border-border last:border-0 hover-elevate" data-testid={`menu-item-${item.id}`}>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.variants && item.variants.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Variants: {item.variants.join(", ")}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{item.category}</td>
                      <td className="py-3 px-4 text-right font-semibold">₹{price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">₹{cost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="secondary">{margin}%</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          size="sm"
                          variant={item.available ? "default" : "secondary"}
                          onClick={() => toggleAvailability(item.id, item.available)}
                          data-testid={`button-toggle-${item.id}`}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </Button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => deleteMenuItemMutation.mutate(item.id)}
                            data-testid={`button-delete-${item.id}`}
                          >
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
        )}
      </div>
    </div>
  );
}
