import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Check, X } from 'lucide-react';
import { useVoiceBidding } from '@/hooks/useVoiceBidding';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VoiceBiddingInterfaceProps {
  auctionId: string;
  currentBid: number;
  onBidPlaced: () => void;
}

export const VoiceBiddingInterface = ({
  auctionId,
  currentBid,
  onBidPlaced,
}: VoiceBiddingInterfaceProps) => {
  const { isListening, transcript, recognizedBid, startListening, resetBid } = useVoiceBidding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmBid = async () => {
    if (!recognizedBid) return;

    if (recognizedBid <= currentBid) {
      toast.error(`Bid must be higher than current bid of $${currentBid}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('bids')
        .insert({
          auction_id: auctionId,
          bidder_id: user.id,
          bidder_name: profile?.username || 'Anonymous',
          amount: recognizedBid,
        });

      if (error) throw error;

      toast.success('Bid placed successfully!');
      resetBid();
      onBidPlaced();
    } catch (error: any) {
      toast.error(error.message || 'Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Voice Bidding</h3>
          <Button
            onClick={startListening}
            disabled={isListening || isSubmitting}
            size="lg"
            className="rounded-full w-16 h-16 p-0 shadow-glow"
            variant={isListening ? "secondary" : "default"}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 animate-pulse" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>
        </div>

        {transcript && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-1">You said:</p>
            <p className="text-foreground">{transcript}</p>
          </div>
        )}

        {recognizedBid && (
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Recognized Bid:</p>
              <p className="text-2xl font-bold text-primary">${recognizedBid.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleConfirmBid}
                disabled={isSubmitting}
                className="flex-1"
                variant="default"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Bid
              </Button>
              <Button
                onClick={resetBid}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Click the microphone and say "My bid is [amount]"
        </p>
      </div>
    </Card>
  );
};
