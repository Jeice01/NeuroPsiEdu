-- Enhance notifications to support overdue alerts for projects, tasks and subtasks

ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS entity_type text,
ADD COLUMN IF NOT EXISTS entity_id uuid,
ADD COLUMN IF NOT EXISTS notification_type text DEFAULT 'general',
ADD COLUMN IF NOT EXISTS dedupe_key text,
ADD COLUMN IF NOT EXISTS email_sent_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS email_last_error text;
CREATE UNIQUE INDEX IF NOT EXISTS notifications_dedupe_key_unique
ON public.notifications (dedupe_key)
WHERE dedupe_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS notifications_user_created_at_idx
ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_entity_idx
ON public.notifications (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS notifications_notification_type_idx
ON public.notifications (notification_type);
