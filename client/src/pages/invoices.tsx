import { useState } from "react";
import { Plus, Download, Send } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
}

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>([
    { id: "1", invoiceNumber: "INV-001", customer: "John Doe", amount: 4500, date: "2024-01-15", dueDate: "2024-01-30", status: "Paid" },
    { id: "2", invoiceNumber: "INV-002", customer: "Jane Smith", amount: 3200, date: "2024-01-18", dueDate: "2024-02-02", status: "Pending" },
    { id: "3", invoiceNumber: "INV-003", customer: "Bob Johnson", amount: 5800, date: "2024-01-10", dueDate: "2024-01-25", status: "Overdue" },
    { id: "4", invoiceNumber: "INV-004", customer: "Alice Williams", amount: 2900, date: "2024-01-20", dueDate: "2024-02-05", status: "Pending" },
  ]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      Paid: "bg-success text-white",
      Pending: "bg-warning text-white",
      Overdue: "bg-danger text-white",
    };
    return <Badge className={config[status]}>{status}</Badge>;
  };

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Invoice Management" />
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><Badge className="bg-success">Paid</Badge><span className="text-sm">{invoices.filter(i => i.status === "Paid").length}</span></div>
            <div className="flex items-center gap-2"><Badge className="bg-warning">Pending</Badge><span className="text-sm">{invoices.filter(i => i.status === "Pending").length}</span></div>
            <div className="flex items-center gap-2"><Badge className="bg-danger">Overdue</Badge><span className="text-sm">{invoices.filter(i => i.status === "Overdue").length}</span></div>
          </div>
          <Button data-testid="button-create-invoice"><Plus className="h-4 w-4 mr-2" />Create Invoice</Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-card rounded-lg border border-card-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Invoice No.</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Issue Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Due Date</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border last:border-0 hover-elevate">
                  <td className="py-3 px-4 font-medium">{invoice.invoiceNumber}</td>
                  <td className="py-3 px-4">{invoice.customer}</td>
                  <td className="py-3 px-4 text-right font-semibold">₹{invoice.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-muted-foreground">{invoice.date}</td>
                  <td className="py-3 px-4 text-muted-foreground">{invoice.dueDate}</td>
                  <td className="py-3 px-4 text-center">{getStatusBadge(invoice.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Send className="h-4 w-4" /></Button>
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