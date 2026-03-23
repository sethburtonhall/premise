CREATE TABLE public.scopes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  input jsonb NOT NULL,
  output text NOT NULL,
  title text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX scopes_user_id_idx ON public.scopes(user_id);

ALTER TABLE public.scopes ENABLE ROW LEVEL SECURITY;
