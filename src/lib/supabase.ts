import { supabase } from "@/integrations/supabase/client";

export const uploadAuctionImage = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('auction-images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('auction-images')
    .getPublicUrl(fileName);

  return publicUrl;
};

export const createProfile = async (userId: string, username: string) => {
  const { error } = await supabase
    .from('profiles')
    .insert({ user_id: userId, username });
  
  if (error) throw error;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};
