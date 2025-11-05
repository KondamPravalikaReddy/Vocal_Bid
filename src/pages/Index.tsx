import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AuctionCard } from '@/components/AuctionCard';
import { AuthModal } from '@/components/AuthModal';
import { supabase } from '@/integrations/supabase/client';
import { Mic, Gavel, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

const DUMMY_AUCTIONS = [
  {
    id: 'dummy-1',
    title: 'Vintage Leather Watch',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
    currentBid: 0,
    basePrice: 250,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dummy-2',
    title: 'Professional Camera Lens',
    imageUrl: 'https://images.unsplash.com/photo-1606951580965-d985f1a28c90?w=800&q=80',
    currentBid: 0,
    basePrice: 450,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dummy-3',
    title: 'Designer Sunglasses',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    currentBid: 0,
    basePrice: 180,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dummy-4',
    title: 'Wireless Headphones',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    currentBid: 0,
    basePrice: 120,
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dummy-5',
    title: 'Smart Fitness Tracker',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
    currentBid: 0,
    basePrice: 95,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dummy-6',
    title: 'Leather Messenger Bag',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    currentBid: 0,
    basePrice: 320,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthRequired = () => {
    setAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    if (session) {
      navigate('/auctions');
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleCreateAuction = () => {
    if (session) {
      navigate('/create-auction');
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">VoiceBid</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auctions')}>
              Auctions
            </Button>
            <Button variant="ghost" onClick={handleCreateAuction}>
              Create Auction
            </Button>
            {session ? (
              <Button onClick={() => navigate('/auctions')} variant="default">
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)} variant="default">
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
              Bid with Your Voice —<br />Join Live Auctions Instantly
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Experience the future of online auctions with voice-powered bidding.
              Simply speak your bid and compete in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="text-lg px-8 shadow-glow"
              >
                <Mic className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auctions')}
                className="text-lg px-8 bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                Browse Auctions
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-accent rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3 p-6 rounded-lg bg-card hover:shadow-auction transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Voice Bidding</h3>
              <p className="text-muted-foreground">
                Place bids hands-free using advanced voice recognition technology
              </p>
            </div>
            <div className="text-center space-y-3 p-6 rounded-lg bg-card hover:shadow-auction transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Real-Time Updates</h3>
              <p className="text-muted-foreground">
                Watch auctions unfold live with instant bid notifications
              </p>
            </div>
            <div className="text-center space-y-3 p-6 rounded-lg bg-card hover:shadow-auction transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Community Driven</h3>
              <p className="text-muted-foreground">
                Join thousands of bidders in exciting live auctions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Auctions
            </h2>
            <p className="text-muted-foreground">
              Discover exciting items up for bid right now
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_AUCTIONS.map((auction) => (
              <AuctionCard
                key={auction.id}
                {...auction}
                isAuthenticated={!!session}
                onAuthRequired={handleAuthRequired}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Start Bidding?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join our community and experience the thrill of voice-powered auctions
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="text-lg px-8 shadow-glow bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 VoiceBid. All rights reserved.</p>
        </div>
      </footer>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;
