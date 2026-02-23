-- Run this block in your Supabase SQL Editor

-- 1. Create a profiles table for extra user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Formulate policies for profiles
-- Users can only view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- (Removed INSERT policy because we will use a secure database trigger instead)

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 1.5 Handle automatic profile creation on signup
-- Create a function that automatically inserts a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$$;

-- Create the trigger that calls the function every time a row is inserted into auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Modify the transactions table to link to the user
ALTER TABLE public.transactions 
ADD COLUMN user_id UUID REFERENCES auth.users ON DELETE CASCADE;

-- If you have existing transactions, you may want to delete them or 
-- assign them to a default user before making this column NOT NULL.
-- For a fresh app, it's safer to make it NOT NULL:
-- ALTER TABLE public.transactions ALTER COLUMN user_id SET NOT NULL;

-- Turn on RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Formulate policies for transactions
-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own transactions
CREATE POLICY "Users can insert own transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own transactions
CREATE POLICY "Users can update own transactions" 
ON public.transactions FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only delete their own transactions
CREATE POLICY "Users can delete own transactions" 
ON public.transactions FOR DELETE 
USING (auth.uid() = user_id);
