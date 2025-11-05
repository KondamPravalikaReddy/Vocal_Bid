-- Create profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create auctions table
CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
  current_bid DECIMAL(10, 2) DEFAULT 0 CHECK (current_bid >= 0),
  image_url TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on auctions
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;

-- Auctions policies
CREATE POLICY "Auctions are viewable by everyone"
  ON public.auctions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create auctions"
  ON public.auctions FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own auctions"
  ON public.auctions FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own auctions"
  ON public.auctions FOR DELETE
  USING (auth.uid() = creator_id);

-- Create bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bidder_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on bids
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Bids policies
CREATE POLICY "Bids are viewable by everyone"
  ON public.bids FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create bids"
  ON public.bids FOR INSERT
  WITH CHECK (auth.uid() = bidder_id);

-- Create function to update auction's current bid
CREATE OR REPLACE FUNCTION update_auction_current_bid()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.auctions
  SET current_bid = NEW.amount,
      updated_at = now()
  WHERE id = NEW.auction_id
    AND NEW.amount > current_bid;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update auction current bid
CREATE TRIGGER on_bid_created
  AFTER INSERT ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION update_auction_current_bid();

-- Enable realtime for auctions and bids
ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;

-- Create storage bucket for auction images
INSERT INTO storage.buckets (id, name, public)
VALUES ('auction-images', 'auction-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for auction images
CREATE POLICY "Anyone can view auction images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'auction-images');

CREATE POLICY "Authenticated users can upload auction images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'auction-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own auction images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'auction-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own auction images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'auction-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );