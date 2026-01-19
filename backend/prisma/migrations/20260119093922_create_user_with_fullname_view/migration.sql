-- Create view that merges first and last name
CREATE VIEW public.user_search_view AS
SELECT
  u.id,
  u."firstName",
  u."lastName",
  u."firstName" || ' ' || u."lastName" AS fullname
FROM public."User" u;