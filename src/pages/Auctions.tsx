import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuctionCard } from '@/components/AuctionCard';
import { supabase } from '@/integrations/supabase/client';
import { Gavel, Plus, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';

interface Auction {
  id: string;
  title: string;
  image_url: string;
  current_bid: number;
  base_price: number;
  deadline: string;
}

const Auctions = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
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
    fetchAuctions();

    const channel = supabase
      .channel('auctions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auctions',
        },
        () => {
          fetchAuctions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuctions(data || []);
    } catch (error: any) {
      toast.error('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Gavel className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">VoiceBid</span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/create-auction')} variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Create Auction
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Active Auctions
          </h1>
          <p className="text-muted-foreground">
            Browse live auctions and place your bids
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No active auctions yet</p>
            <Button onClick={() => navigate('/create-auction')}>
              Create the First Auction
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                id={auction.id}
                title={auction.title}
                imageUrl={auction.image_url}
                currentBid={auction.current_bid}
                basePrice={auction.base_price}
                deadline={auction.deadline}
                isAuthenticated={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;
