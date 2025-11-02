import { useState } from "react";
import { Gift, Award, TrendingUp } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";

interface LoyaltyMember {
  id: string;
  name: string;
  tier: "Silver" | "Gold" | "Platinum";
  points: number;
  totalSpent: number;
  joinDate: string;
}

export default function LoyaltyPage() {
  const [members] = useState<LoyaltyMember[]>([
    { id: "1", name: "John Doe", tier: "Platinum", points: 5420, totalSpent: 54200, joinDate: "2023-01-15" },
    { id: "2", name: "Jane Smith", tier: "Gold", points: 3180, totalSpent: 31800, joinDate: "2023-03-20" },
    { id: "3", name: "Bob Johnson", tier: "Silver", points: 1250, totalSpent: 12500, joinDate: "2023-08-10" },
    { id: "4", name: "Alice Williams", tier: "Platinum", points: 6890, totalSpent: 68900, joinDate: "2022-11-05" },
  ]);

  const getTierBadge = (tier: string) => {
    const config: Record<string, string> = {
      Platinum: "bg-warning text-warning-foreground",
      Gold: "bg-primary text-primary-foreground",
      Silver: "bg-muted text-muted-foreground",
    };
    return <Badge className={config[tier]}>{tier}</Badge>;
  };

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Loyalty Program" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Members" value={members.length} icon={Award} color="blue" />
          <StatCard title="Points Issued" value="16,740" icon={Gift} color="green" />
          <StatCard title="Redemptions" value="124" icon={TrendingUp} color="yellow" />
        </div>

        <div className="bg-card rounded-lg border border-card-border p-6">
          <h3 className="text-lg font-semibold mb-4">Loyalty Members</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Member</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Tier</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Points</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Spent</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Member Since</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-border last:border-0 hover-elevate">
                  <td className="py-3 px-4 font-medium">{member.name}</td>
                  <td className="py-3 px-4 text-center">{getTierBadge(member.tier)}</td>
                  <td className="py-3 px-4 text-right font-semibold">{member.points.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">₹{member.totalSpent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{member.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}