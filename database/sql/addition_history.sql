
ALTER TABLE public.budget_plan
ADD COLUMN bg_budget_reset INT DEFAULT 1 NOT NULL CHECK (bg_budget_reset BETWEEN 1 AND 28);

ALTER TABLE public.account
ADD COLUMN account_color_mode INT;

ALTER TABLE public.budget_category
ALTER COLUMN cat_color TYPE VARCHAR(7);


UPDATE public.budget_plan
SET bg_budget_reset = 1
WHERE bg_budget_reset IS NULL;