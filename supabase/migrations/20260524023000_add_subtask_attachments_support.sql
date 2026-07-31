-- Add support for attachments linked directly to subtasks

ALTER TABLE public.task_attachments
ADD COLUMN IF NOT EXISTS subtask_id uuid;
ALTER TABLE public.task_attachments
DROP CONSTRAINT IF EXISTS task_attachments_subtask_id_fkey;
ALTER TABLE public.task_attachments
ADD CONSTRAINT task_attachments_subtask_id_fkey
FOREIGN KEY (subtask_id)
REFERENCES public.subtasks(id)
ON DELETE CASCADE;
ALTER TABLE public.task_attachments
DROP CONSTRAINT IF EXISTS task_or_project_attachment_check;
ALTER TABLE public.task_attachments
DROP CONSTRAINT IF EXISTS task_project_or_subtask_attachment_check;
ALTER TABLE public.task_attachments
ADD CONSTRAINT task_project_or_subtask_attachment_check
CHECK (
  (
    task_id IS NOT NULL
    AND project_id IS NULL
    AND subtask_id IS NULL
  )
  OR
  (
    task_id IS NULL
    AND project_id IS NOT NULL
    AND subtask_id IS NULL
  )
  OR
  (
    task_id IS NULL
    AND project_id IS NULL
    AND subtask_id IS NOT NULL
  )
);
CREATE INDEX IF NOT EXISTS idx_task_attachments_subtask_id
ON public.task_attachments(subtask_id);
DROP POLICY IF EXISTS "Users can view task or project attachments"
ON public.task_attachments;
DROP POLICY IF EXISTS "Users can create task or project attachments"
ON public.task_attachments;
DROP POLICY IF EXISTS "Users can view task project or subtask attachments"
ON public.task_attachments;
DROP POLICY IF EXISTS "Users can create task project or subtask attachments"
ON public.task_attachments;
CREATE POLICY "Users can view task project or subtask attachments"
ON public.task_attachments
FOR SELECT
TO authenticated
USING (
  (
    task_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.tasks t
      WHERE t.id = task_attachments.task_id
        AND (
          t.assigned_to = auth.uid()
          OR t.created_by = auth.uid()
          OR EXISTS (
            SELECT 1
            FROM public.project_members pm
            WHERE pm.project_id = t.project_id
              AND pm.user_id = auth.uid()
          )
        )
    )
  )
  OR
  (
    project_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.projects p
      WHERE p.id = task_attachments.project_id
        AND (
          p.created_by = auth.uid()
          OR is_project_member(auth.uid(), p.id)
        )
    )
  )
  OR
  (
    subtask_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.subtasks st
      JOIN public.tasks t ON t.id = st.task_id
      WHERE st.id = task_attachments.subtask_id
        AND (
          st.assigned_to = auth.uid()
          OR t.assigned_to = auth.uid()
          OR t.created_by = auth.uid()
          OR EXISTS (
            SELECT 1
            FROM public.project_members pm
            WHERE pm.project_id = t.project_id
              AND pm.user_id = auth.uid()
          )
        )
    )
  )
);
CREATE POLICY "Users can create task project or subtask attachments"
ON public.task_attachments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = uploaded_by
  AND (
    (
      task_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.tasks t
        WHERE t.id = task_attachments.task_id
          AND (
            t.assigned_to = auth.uid()
            OR t.created_by = auth.uid()
            OR EXISTS (
              SELECT 1
              FROM public.project_members pm
              WHERE pm.project_id = t.project_id
                AND pm.user_id = auth.uid()
            )
          )
      )
    )
    OR
    (
      project_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = task_attachments.project_id
          AND (
            p.created_by = auth.uid()
            OR is_project_member(auth.uid(), p.id)
          )
      )
    )
    OR
    (
      subtask_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.subtasks st
        JOIN public.tasks t ON t.id = st.task_id
        WHERE st.id = task_attachments.subtask_id
          AND (
            st.assigned_to = auth.uid()
            OR t.assigned_to = auth.uid()
            OR t.created_by = auth.uid()
            OR EXISTS (
              SELECT 1
              FROM public.project_members pm
              WHERE pm.project_id = t.project_id
                AND pm.user_id = auth.uid()
            )
          )
      )
    )
  )
);
