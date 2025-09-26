-- Fix the security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', 'Anonymous'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create chat_messages table for real-time chat
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  is_counselor BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat policies
CREATE POLICY "Users can view their own messages" 
ON public.chat_messages 
FOR SELECT 
USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can insert their own messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (sender_id = auth.uid());

-- Create mood_entries table for daily mood tracking
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5),
  mood_emoji TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own mood entries" 
ON public.mood_entries 
FOR ALL 
USING (user_id = auth.uid());