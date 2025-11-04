import { useState } from "react";
import { Minus, Plus, Trash2, User, Table, StickyNote, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
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

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface OrderCartProps {
  items: OrderItem[];
  serviceType: "dine-in" | "delivery" | "pickup";
  onServiceTypeChange: (type: "dine-in" | "delivery" | "pickup") => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onCheckout: () => void;
  onSendKOT?: () => void;
  showKOTButton?: boolean;
}

export default function OrderCart({
  items,
  serviceType,
  onServiceTypeChange,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  onCheckout,
  onSendKOT,
  showKOTButton = true,
}: OrderCartProps) {
  const [notesDialogItem, setNotesDialogItem] = useState<OrderItem | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  const [customNote, setCustomNote] = useState("");
  
  const predefinedNotes = [
    "Make it Spicy",
    "Less Spicy",
    "No Onions",
    "Extra Cheese",
    "Well Done",
    "Medium Rare",
    "No Salt",
    "Extra Sauce",
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleOpenNotes = (item: OrderItem) => {
    setNotesDialogItem(item);
    setTempNotes(item.notes || "");
    setCustomNote("");
  };

  const handleSaveNotes = () => {
    if (notesDialogItem && onUpdateNotes) {
      const finalNotes = customNote.trim() || tempNotes;
      onUpdateNotes(notesDialogItem.id, finalNotes);
    }
    setNotesDialogItem(null);
    setTempNotes("");
    setCustomNote("");
  };

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
              className="flex-1 capitalize text-xs sm:text-sm"
            >
              {type.replace("-", " ")}
            </Button>
          ))}
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
              <div key={item.id} className="border border-border rounded-lg p-3" data-testid={`cart-item-${item.id}`}>
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => onRemoveItem(item.id)}
                    data-testid={`button-remove-${item.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
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
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenNotes(item)}
                    data-testid={`button-notes-${item.id}`}
                  >
                    <StickyNote className="h-3 w-3 mr-1" />
                    {item.notes ? "Edit" : "Add"} Note
                  </Button>
                </div>
                
                {item.notes && (
                  <p className="text-xs text-muted-foreground mt-2 italic bg-muted/50 p-2 rounded">
                    {item.notes}
                  </p>
                )}
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
        
        {showKOTButton && onSendKOT && (
          <Button
            variant="default"
            className="w-full mb-2"
            disabled={items.length === 0}
            onClick={onSendKOT}
            data-testid="button-send-kot"
          >
            <Send className="h-4 w-4 mr-2" />
            Send to Kitchen (KOT)
          </Button>
        )}
        
        <Button
          className="w-full"
          size="lg"
          disabled={items.length === 0}
          onClick={onCheckout}
          data-testid="button-checkout"
        >
          Checkout
        </Button>
      </div>

      <Dialog open={!!notesDialogItem} onOpenChange={() => setNotesDialogItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notes for {notesDialogItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select from predefined notes:</label>
              <Select value={tempNotes} onValueChange={setTempNotes}>
                <SelectTrigger data-testid="select-predefined-notes">
                  <SelectValue placeholder="Select a note" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedNotes.map((note) => (
                    <SelectItem key={note} value={note}>
                      {note}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Or enter custom note:</label>
              <Input
                placeholder="Enter custom note"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                data-testid="input-custom-note"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setNotesDialogItem(null)}
                className="flex-1"
                data-testid="button-cancel-notes"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNotes}
                className="flex-1"
                data-testid="button-save-notes"
              >
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
