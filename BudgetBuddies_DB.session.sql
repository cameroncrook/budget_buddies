SELECT c.bg_id, SUM(s.sub_budget) as total_budget, SUM(e.exp_cost) as total_spent FROM public.sub_category s
JOIN public.budget_category c
ON s.cat_id = c.cat_id
JOIN public.expenditure e
ON e.sub_id = s.sub_id
GROUP BY c.bg_id
HAVING c.bg_id = 1 AND e.exp_date BETWEEN '2024-01-01' AND '2024-12-31';
