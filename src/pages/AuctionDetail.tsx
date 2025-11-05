import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoiceBiddingInterface } from '@/components/VoiceBiddingInterface';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Gavel, ArrowLeft, Clock, TrendingUp, History } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface Auction {
  id: string;
  title: string;
  description: string;
  image_url: string;
  current_bid: number;
  base_price: number;
  deadline: string;
  status: string;
}

interface Bid {
  id: string;
  bidder_name: string;
  amount: number;
  created_at: string;
}

const AuctionDetail = () => {
  const { id } = useParams();
  const [session, setSession] = useState<Session | null>(null);
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (id) {
      fetchAuctionData();

      // Subscribe to real-time updates
      const auctionChannel = supabase
        .channel(`auction-${id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'auctions',
            filter: `id=eq.${id}`,
          },
          () => {
            fetchAuctionData();
          }
        )
        .subscribe();

      const bidsChannel = supabase
        .channel(`bids-${id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bids',
            filter: `auction_id=eq.${id}`,
          },
          () => {
            fetchBids();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(auctionChannel);
        supabase.removeChannel(bidsChannel);
      };
    }
  }, [id]);

  const fetchAuctionData = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setAuction(data);
      await fetchBids();
    } catch (error: any) {
      toast.error('Failed to load auction');
      navigate('/auctions');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('auction_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setBids(data || []);
    } catch (error: any) {
      console.error('Failed to load bids:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading auction...</div>
      </div>
    );
  }

  if (!auction) {
    return null;
  }

  const timeRemaining = new Date(auction.deadline).getTime() - Date.now();
  const hoursLeft = Math.floor(timeRemaining / (1000 * 60 * 60));
  const daysLeft = Math.floor(hoursLeft / 24);
  const minutesLeft = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Gavel className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">VoiceBid</span>
          </div>
          <Button onClick={() => navigate('/auctions')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Auctions
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Details */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-border/50 shadow-auction">
              <div className="aspect-square overflow-hidden">
                <img
                  src={auction.image_url}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50">
              <h1 className="text-3xl font-bold text-foreground mb-4">{auction.title}</h1>
              {auction.description && (
                <p className="text-muted-foreground">{auction.description}</p>
              )}
            </Card>
          </div>

          {/* Right Column - Bidding Interface */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                    <p className="text-4xl font-bold text-primary flex items-center gap-2">
                      <TrendingUp className="w-8 h-8" />
                      ${auction.current_bid > 0 ? auction.current_bid.toFixed(2) : auction.base_price.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {daysLeft > 0 ? `${daysLeft}d ${hoursLeft % 24}h` : `${hoursLeft}h ${minutesLeft}m`}
                  </Badge>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Base Price: <span className="font-semibold text-foreground">${auction.base_price.toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Bids: <span className="font-semibold text-foreground">{bids.length}</span>
                  </p>
                </div>
              </div>
            </Card>

            <VoiceBiddingInterface
              auctionId={auction.id}
              currentBid={auction.current_bid > 0 ? auction.current_bid : auction.base_price}
              onBidPlaced={fetchAuctionData}
            />

            {/* Bid History */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Bid History
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bids.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No bids yet</p>
                ) : (
                  bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{bid.bidder_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bid.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary">${bid.amount.toFixed(2)}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
