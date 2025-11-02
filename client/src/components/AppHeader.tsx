import { Search, Bell, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  return (
    <header className="bg-card border-b border-card-border px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold text-primary">{title}</h1>
          {showSearch && (
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bills, items..."
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
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
            onClick={onSettingsClick}
            data-testid="button-settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onProfileClick}
            data-testid="button-profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}