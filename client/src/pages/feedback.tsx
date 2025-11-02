import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";

interface Feedback {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  sentiment: "Positive" | "Neutral" | "Negative";
}

export default function FeedbackPage() {
  const [feedback] = useState<Feedback[]>([
    { id: "1", customer: "John Doe", rating: 5, comment: "Excellent food and service!", date: "2024-01-20", sentiment: "Positive" },
    { id: "2", customer: "Jane Smith", rating: 4, comment: "Good food, but slow service.", date: "2024-01-19", sentiment: "Neutral" },
    { id: "3", customer: "Bob Johnson", rating: 5, comment: "Amazing experience! Will come again.", date: "2024-01-18", sentiment: "Positive" },
    { id: "4", customer: "Alice Williams", rating: 2, comment: "Food was cold when served.", date: "2024-01-17", sentiment: "Negative" },
  ]);

  const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1);

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === "Positive") return <ThumbsUp className="h-4 w-4 text-success" />;
    if (sentiment === "Negative") return <ThumbsDown className="h-4 w-4 text-danger" />;
    return <span className="h-4 w-4 text-warning">-</span>;
  };

  return (
    <div className="h-screen flex flex-col">
      <AppHeader title="Customer Feedback" />
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex gap-8">
          <div>
            <div className="text-3xl font-bold">{avgRating}</div>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < Math.round(parseFloat(avgRating)) ? "fill-warning text-warning" : "text-muted"}`} />))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
          </div>
          <div className="flex gap-6">
            <div><div className="text-2xl font-bold text-success">{feedback.filter(f => f.sentiment === "Positive").length}</div><p className="text-sm text-muted-foreground">Positive</p></div>
            <div><div className="text-2xl font-bold text-warning">{feedback.filter(f => f.sentiment === "Neutral").length}</div><p className="text-sm text-muted-foreground">Neutral</p></div>
            <div><div className="text-2xl font-bold text-danger">{feedback.filter(f => f.sentiment === "Negative").length}</div><p className="text-sm text-muted-foreground">Negative</p></div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="bg-card border border-card-border rounded-lg p-4 hover-elevate">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{item.customer}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-3 w-3 ${i < item.rating ? "fill-warning text-warning" : "text-muted"}`} />))}</div>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSentimentIcon(item.sentiment)}
                  <Badge variant="outline">{item.sentiment}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{item.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}