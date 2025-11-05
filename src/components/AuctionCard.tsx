import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuctionCardProps {
  id: string;
  title: string;
  imageUrl: string;
  currentBid: number;
  basePrice: number;
  deadline: string;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
}

export const AuctionCard = ({
  id,
  title,
  imageUrl,
  currentBid,
  basePrice,
  deadline,
  isAuthenticated = false,
  onAuthRequired,
}: AuctionCardProps) => {
  const navigate = useNavigate();
  
  const timeRemaining = new Date(deadline).getTime() - Date.now();
  const hoursLeft = Math.floor(timeRemaining / (1000 * 60 * 60));
  const daysLeft = Math.floor(hoursLeft / 24);

  const handleBidClick = () => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
    } else {
      navigate(`/auction/${id}`);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-auction transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg text-foreground line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current Bid</p>
            <p className="text-xl font-bold text-primary flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              ${currentBid > 0 ? currentBid.toFixed(2) : basePrice.toFixed(2)}
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {daysLeft > 0 ? `${daysLeft}d` : `${hoursLeft}h`}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleBidClick}
          className="w-full font-semibold"
          variant="default"
        >
          Start Bidding
        </Button>
      </CardFooter>
    </Card>
  );
};
