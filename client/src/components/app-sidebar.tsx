import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  ChefHat,
  BarChart3,
  Settings,
  Package,
  FileText,
  Utensils,
  Truck,
  Globe,
  Gift,
  Package2,
  ShoppingBag,
  UserCog,
  Clock,
  Calendar,
  DollarSign,
  CreditCard,
  Calculator,
  Receipt,
  FileSpreadsheet,
  TrendingUp,
  Tag,
  Ticket,
  MessageSquare,
  PieChart,
  LineChart,
  BarChart,
  Trash2,
  Building2,
  Shield,
  FileCheck,
  Bell,
  HelpCircle,
  User,
  Database,
  QrCode,
  ListOrdered,
  PartyPopper,
  Printer,
  Mail,
  Megaphone,
  Plug,
  HardDrive,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

const menuGroups = [
  {
    label: "Core POS",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Billing / POS", url: "/billing", icon: ShoppingCart },
      { title: "Tables", url: "/tables", icon: Utensils },
      { title: "Kitchen Display", url: "/kitchen", icon: ChefHat },
      { title: "Menu Management", url: "/menu", icon: FileText },
      { title: "Reports", url: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Delivery", url: "/delivery", icon: Truck },
      { title: "Online Orders", url: "/online-orders", icon: Globe },
      { title: "Reservations", url: "/reservations", icon: Calendar },
      { title: "Waiting List", url: "/waiting-list", icon: ListOrdered },
      { title: "Events", url: "/events", icon: PartyPopper },
    ],
  },
  {
    label: "Customer Management",
    items: [
      { title: "Customers", url: "/customers", icon: Users },
      { title: "Loyalty Program", url: "/loyalty", icon: Gift },
      { title: "Feedback", url: "/feedback", icon: MessageSquare },
      { title: "Gift Cards", url: "/gift-cards", icon: Ticket },
    ],
  },
  {
    label: "Inventory",
    items: [
      { title: "Inventory", url: "/inventory", icon: Package },
      { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingBag },
      { title: "Suppliers", url: "/suppliers", icon: Package2 },
      { title: "Wastage", url: "/wastage", icon: Trash2 },
    ],
  },
  {
    label: "Staff & HR",
    items: [
      { title: "Staff", url: "/staff", icon: UserCog },
      { title: "Attendance", url: "/attendance", icon: Clock },
      { title: "Commission", url: "/commission", icon: DollarSign },
      { title: "User Roles", url: "/user-roles", icon: Shield },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Expenses", url: "/expenses", icon: Receipt },
      { title: "Payment Settlement", url: "/payment-settlement", icon: CreditCard },
      { title: "Accounting", url: "/accounting", icon: Calculator },
      { title: "Tax Reports", url: "/tax-reports", icon: FileSpreadsheet },
      { title: "Invoices", url: "/invoices", icon: FileCheck },
      { title: "Day End Settlement", url: "/day-end-settlement", icon: DollarSign },
    ],
  },
  {
    label: "Marketing & Offers",
    items: [
      { title: "Offers & Promotions", url: "/offers", icon: Tag },
      { title: "Coupons", url: "/coupons", icon: Ticket },
      { title: "Marketing", url: "/marketing", icon: Megaphone },
      { title: "QR Codes", url: "/qr-codes", icon: QrCode },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Analytics", url: "/analytics", icon: PieChart },
      { title: "Sales Detailed", url: "/sales-detailed", icon: LineChart },
      { title: "Item Performance", url: "/item-performance", icon: BarChart },
      { title: "Kitchen Performance", url: "/kitchen-performance", icon: TrendingUp },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Multi-Location", url: "/multi-location", icon: Building2 },
      { title: "Integrations", url: "/integrations", icon: Plug },
      { title: "Printer Config", url: "/printer-config", icon: Printer },
      { title: "Email Templates", url: "/email-templates", icon: Mail },
      { title: "Notifications", url: "/notifications", icon: Bell },
      { title: "Audit Logs", url: "/audit-logs", icon: FileCheck },
      { title: "Database", url: "/database", icon: Database },
      { title: "Backup", url: "/backup", icon: HardDrive },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
  {
    label: "Help",
    items: [
      { title: "Help & Support", url: "/help", icon: HelpCircle },
      { title: "Profile", url: "/profile", icon: User },
    ],
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-primary px-4 py-4">
            🍽️ RestaurantPOS
          </SidebarGroupLabel>
        </SidebarGroup>
        
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location === item.url}
                      data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <a href={item.url} onClick={(e) => {
                        e.preventDefault();
                        setLocation(item.url);
                      }}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
