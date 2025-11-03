import { Search, Bell, User, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useLocation } from "wouter";

interface AppHeaderProps {
  title?: string;
  showSearch?: boolean;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export default function AppHeader({
  title = "Restaurant POS",
  showSearch = true,
  onProfileClick,
  onSettingsClick,
}: AppHeaderProps) {
  const [, setLocation] = useLocation();
  
  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      setLocation("/profile");
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      setLocation("/settings");
    }
  };

  return (
    <header className="bg-card border-b border-card-border px-3 sm:px-6 py-3 flex-shrink-0">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <SidebarTrigger className="md:hidden" data-testid="button-sidebar-toggle">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <h1 className="text-lg sm:text-xl font-bold text-primary truncate">{title}</h1>
          {showSearch && (
            <div className="relative max-w-md flex-1 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {showSearch && (
            <Button
              size="icon"
              variant="ghost"
              className="sm:hidden"
              data-testid="button-search-mobile"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="relative"
            data-testid="button-notifications"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-danger text-white text-xs">
              3
            </Badge>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSettingsClick}
            data-testid="button-settings"
            className="hidden sm:flex"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleProfileClick}
            data-testid="button-profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
