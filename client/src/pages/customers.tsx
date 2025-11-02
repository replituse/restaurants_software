import { useState } from "react";
import { Plus, Search, Phone, Mail } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  segment: "VIP" | "Regular" | "New";
  lastVisit: string;
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Doe",
      phone: "+91 9876543210",
      email: "john@example.com",
      totalOrders: 45,
      totalSpent: 12500,
      segment: "VIP",
      lastVisit: "2 days ago",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "+91 9876543211",
      email: "jane@example.com",
      totalOrders: 23,
      totalSpent: 6800,
      segment: "Regular",
      lastVisit: "1 week ago",
    },
    {
      id: "3",
      name: "Bob Johnson",
      phone: "+91 9876543212",
      email: "bob@example.com",
      totalOrders: 2,
      totalSpent: 450,
      segment: "New",
      lastVisit: "Today",
    },
    {
      id: "4",
      name: "Alice Williams",
      phone: "+91 9876543213",
      email: "alice@example.com",
      totalOrders: 38,
      totalSpent: 10200,
      segment: "VIP",
      lastVisit: "Yesterday",
    },
    {
      id: "5",
      name: "Charlie Brown",
      phone: "+91 9876543214",
      email: "charlie@example.com",
      totalOrders: 15,
      totalSpent: 4300,
      segment: "Regular",
      lastVisit: "3 days ago",
    },
  ]);

  const getSegmentBadge = (segment: string) => {
    const config: Record<string, string> = {
      VIP: "bg-warning text-warning-foreground",
      Regular: "bg-primary text-primary-foreground",
      New: "bg-success text-success-foreground",
    };

    return <Badge className={config[segment]}>{segment}</Badge>;
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Customer Management" showSearch={false} />

      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-customer-search"
            />
          </div>
          <Button data-testid="button-add-customer">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-warning text-warning-foreground">VIP</Badge>
            <span className="text-sm text-muted-foreground">
              {customers.filter((c) => c.segment === "VIP").length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">Regular</Badge>
            <span className="text-sm text-muted-foreground">
              {customers.filter((c) => c.segment === "Regular").length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-success text-success-foreground">New</Badge>
            <span className="text-sm text-muted-foreground">
              {customers.filter((c) => c.segment === "New").length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-card rounded-lg border border-card-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Segment</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Orders</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Spent</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Last Visit</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0 hover-elevate" data-testid={`customer-${customer.id}`}>
                  <td className="py-3 px-4">
                    <p className="font-medium">{customer.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">{getSegmentBadge(customer.segment)}</td>
                  <td className="py-3 px-4 text-right">{customer.totalOrders}</td>
                  <td className="py-3 px-4 text-right font-semibold">₹{customer.totalSpent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{customer.lastVisit}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}