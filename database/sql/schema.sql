
CREATE TABLE IF NOT EXISTS public.budget_plan (
    bg_id SERIAL PRIMARY KEY,
    bg_name VARCHAR(25) NOT NULL,
    bg_sharecode VARCHAR(100) UNIQUE NOT NULL,
    bg_budget_reset INT DEFAULT 1 NOT NULL CHECK (bg_budget_reset BETWEEN 1 AND 28)
);





CREATE TABLE IF NOT EXISTS public.account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(25) NOT NULL,
    account_username VARCHAR(25) UNIQUE NOT NULL,
    account_password VARCHAR(100) NOT NULL,
    account_color_mode VARCHAR(20) DEFAULT 'light-blue',
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
);





CREATE TABLE IF NOT EXISTS public.budget_category (
    cat_id SERIAL PRIMARY KEY,
    cat_name VARCHAR(25) NOT NULL,
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.sub_category (
    sub_id SERIAL PRIMARY KEY,
    cat_id INT NOT NULL,
    sub_name VARCHAR(25) NOT NULL,
    slug TEXT NOT NULL,
    sub_budget NUMERIC(10, 2) NOT NULL,
    is_savings BOOLEAN DEFAULT false,

    CONSTRAINT fk_cat FOREIGN KEY (cat_id) REFERENCES budget_category(cat_id) ON DELETE CASCADE,
    CONSTRAINT unique_slug_per_category UNIQUE (cat_id, slug)
);


CREATE TABLE IF NOT EXISTS public.savings (
    sub_id INT PRIMARY KEY REFERENCES sub_category(sub_id) ON DELETE CASCADE,
    savings_total NUMERIC(10, 2),
    savings_last_update DATE DEFAULT CURRENT_DATE
)

CREATE TABLE IF NOT EXISTS public.expenditure (
    exp_id SERIAL PRIMARY KEY,
    sub_id INT NOT NULL,
    account_id INT NOT NULL,
    exp_for VARCHAR(200) NOT NULL,
    exp_description TEXT,
    exp_date DATE DEFAULT CURRENT_DATE,
    exp_cost NUMERIC(10, 2) NOT NULL,

    FOREIGN KEY (account_id) REFERENCES account(account_id),
    FOREIGN KEY (sub_id) REFERENCES sub_category(sub_id) ON DELETE CASCADE
);