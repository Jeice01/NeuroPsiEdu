-- Fix Storage RLS policies for task/project/subtask attachments
-- Frontend uploads the file first, then inserts the row into public.task_attachments.
-- Therefore, the INSERT policy on storage.objects cannot depend on a pre-existing task_attachments row.

DROP POLICY IF EXISTS "Users can upload attachments to authorized tasks/projects" ON storage.objects;
DROP POLICY IF EXISTS "Users can view authorized task or project attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments from storage" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload task project or subtask attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view task project or subtask attachment files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own task project or subtask attachment files" ON storage.objects;
CREATE POLICY "Users can upload task project or subtask attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task-attachments'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[3] = auth.uid()::text
  AND (
    (
      (storage.foldername(name))[1] = 'project'
      AND EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id::text = (storage.foldername(name))[2]
          AND (
            p.created_by = auth.uid()
            OR public.is_project_member(auth.uid(), p.id)
          )
      )
    )
    OR
    (
      (storage.foldername(name))[1] = 'task'
      AND EXISTS (
        SELECT 1
        FROM public.tasks t
        WHERE t.id::text = (storage.foldername(name))[2]
          AND (
            t.assigned_to = auth.uid()
            OR t.created_by = auth.uid()
            OR (
              t.project_id IS NOT NULL
              AND public.is_project_member(auth.uid(), t.project_id)
            )
          )
      )
    )
    OR
    (
      (storage.foldername(name))[1] = 'subtask'
      AND EXISTS (
        SELECT 1
        FROM public.subtasks st
        JOIN public.tasks t ON t.id = st.task_id
        WHERE st.id::text = (storage.foldername(name))[2]
          AND (
            st.assigned_to = auth.uid()
            OR t.assigned_to = auth.uid()
            OR t.created_by = auth.uid()
            OR (
              t.project_id IS NOT NULL
              AND public.is_project_member(auth.uid(), t.project_id)
            )
          )
      )
    )
  )
);
CREATE POLICY "Users can view task project or subtask attachment files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'task-attachments'
  AND EXISTS (
    SELECT 1
    FROM public.task_attachments ta
    WHERE ta.file_path = storage.objects.name
      AND (
        (
          ta.project_id IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM public.projects p
            WHERE p.id = ta.project_id
              AND (
                p.created_by = auth.uid()
                OR public.is_project_member(auth.uid(), p.id)
              )
          )
        )
        OR
        (
          ta.task_id IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM public.tasks t
            WHERE t.id = ta.task_id
              AND (
                t.assigned_to = auth.uid()
                OR t.created_by = auth.uid()
                OR (
                  t.project_id IS NOT NULL
                  AND public.is_project_member(auth.uid(), t.project_id)
                )
              )
          )
        )
        OR
        (
          ta.subtask_id IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM public.subtasks st
            JOIN public.tasks t ON t.id = st.task_id
            WHERE st.id = ta.subtask_id
              AND (
                st.assigned_to = auth.uid()
                OR t.assigned_to = auth.uid()
                OR t.created_by = auth.uid()
                OR (
                  t.project_id IS NOT NULL
                  AND public.is_project_member(auth.uid(), t.project_id)
                )
              )
          )
        )
      )
  )
);
CREATE POLICY "Users can delete own task project or subtask attachment files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'task-attachments'
  AND (storage.foldername(name))[3] = auth.uid()::text
);
