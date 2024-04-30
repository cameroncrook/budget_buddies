
CREATE TABLE public.budget_plan (
    bg_id SERIAL PRIMARY KEY,
    bg_name VARCHAR(25) NOT NULL,
    bg_sharecode VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE public.account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(25) NOT NULL,
    account_username VARCHAR(25) UNIQUE NOT NULL,
    account_password VARCHAR(100) NOT NULL,
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
);

CREATE TABLE public.budget_category (
    cat_id SERIAL PRIMARY KEY,
    cat_name VARCHAR(25) NOT NULL,
    cat_color VARCHAR(20),
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
);

CREATE TABLE public.sub_category (
    sub_id SERIAL PRIMARY KEY,
    cat_id INT NOT NULL,
    sub_name VARCHAR(25) NOT NULL,
    sub_budget MONEY NOT NULL,

    FOREIGN KEY (cat_id) REFERENCES budget_category(cat_id) ON DELETE CASCADE
);

CREATE TABLE public.expenditure (
    exp_id SERIAL PRIMARY KEY,
    sub_id INT NOT NULL,
    account_id INT NOT NULL,
    exp_for VARCHAR(200) NOT NULL,
    exp_description TEXT,
    exp_date DATE DEFAULT CURRENT_DATE,
    exp_cost money NOT NULL,

    FOREIGN KEY (account_id) REFERENCES account(account_id),
    FOREIGN KEY (sub_id) REFERENCES sub_category(sub_id) ON DELETE CASCADE
);