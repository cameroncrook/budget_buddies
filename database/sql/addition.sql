CREATE TABLE IF NOT EXISTS public.savings (
    sub_id INT PRIMARY KEY REFERENCES sub_category(sub_id) ON DELETE CASCADE,
    savings_total NUMERIC(10, 2),
    savings_last_update DATE DEFAULT CURRENT_DATE
);

ALTER TABLE public.sub_category
ADD COLUMN is_savings BOOLEAN DEFAULT false;

ALTER TABLE public.account
ALTER COLUMN account_color_mode
SET DATA TYPE VARCHAR(20);

ALTER TABLE public.account
ALTER COLUMN account_color_mode
SET DEFAULT 'dark-blue';

ALTER TABLE public.sub_category
ALTER COLUMN sub_budget
SET DATA TYPE NUMERIC(10, 2)
USING sub_budget::NUMERIC(10, 2);

ALTER TABLE public.expenditure
ALTER COLUMN exp_cost
SET DATA TYPE NUMERIC(10, 2)
USING exp_cost::NUMERIC(10, 2);

ALTER TABLE sub_category
ADD COLUMN slug TEXT;

ALTER TABLE sub_category
ADD CONSTRAINT unique_slug_per_category
UNIQUE (cat_id, slug);

ALTER TABLE budget_category
DROP COLUMN IF EXISTS cat_color;

CREATE TABLE IF NOT EXISTS public.balance {
    balance_id SERIAL PRIMARY,
    balance_amount NUMERIC(10, 2) NOT NULL,
    balance_date DATE DEFAULT CURRENT_DATE,
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
};