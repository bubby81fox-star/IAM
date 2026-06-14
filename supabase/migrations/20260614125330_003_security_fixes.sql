-- Fix search_path mutability for all functions
-- Revoke execute permissions where not needed

-- Fix handle_new_user: set search_path, revoke public execute (only called by trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix angel_message_filter: set search_path, revoke public execute (only called by trigger)
CREATE OR REPLACE FUNCTION public.angel_message_filter()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check global blacklisted phrases
  IF EXISTS (
    SELECT 1 FROM public.angel_filters 
    WHERE NEW.message_text ILIKE '%' || phrase || '%' 
    AND is_blacklisted = TRUE
    AND domain_id IS NULL
  ) THEN
    RAISE EXCEPTION 'Content violates community guidelines.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix update_updated_at: set search_path (this one can be SECURITY INVOKER since it just updates a timestamp)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER 
SECURITY INVOKER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Revoke execute permissions from anon and authenticated for trigger functions
-- These should only be called by triggers, not directly
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.angel_message_filter() FROM anon, authenticated;

-- update_updated_at is SECURITY INVOKER now, so execution by authenticated users is safe
-- (it will run with their permissions, and RLS policies will apply)