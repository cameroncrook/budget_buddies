
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
    account_color_mode INT,
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
);






CREATE TABLE IF NOT EXISTS public.meal (
    meal_id SERIAL PRIMARY KEY,
    meal_name VARCHAR(25),
    meal_link TEXT,
    meal_instructions TEXT,
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.ingredient (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS public.meal_ingredient (
    meal_ingredient_id SERIAL PRIMARY KEY,
    meal_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    meal_ingredient_quantity VARCHAR(25),

    FOREIGN KEY (meal_id) REFERENCES meal(meal_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.shopping_meals (
    shopping_meals_id SERIAL PRIMARY KEY,
    bg_id INT NOT NULL,
    meal_id INT NOT NULL,
    shopping_meals_date DATE NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE,
    FOREIGN KEY (meal_id) REFERENCES meal(meal_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.shopping_manual (
    shopping_manual_id SERIAL PRIMARY KEY,
    shopping_manual_item VARCHAR(25) NOT NULL,
    shopping_manual_quantity VARCHAR(25),
    shopping_manual_date DATE NOT NULL,
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
);





CREATE TABLE IF NOT EXISTS public.car (
    car_id SERIAL PRIMARY KEY,
    car_name VARCHAR(25),
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.car_oil_change (
    car_oil_change_id SERIAL PRIMARY KEY,
    car_id INT NOT NULL,
    car_oil_change_date DATE NOT NULL,
    car_oil_change_milage INT,

    FOREIGN KEY (car_id) REFERENCES car(car_id) ON DELETE CASCADE
);






CREATE TABLE IF NOT EXISTS public.budget_category (
    cat_id SERIAL PRIMARY KEY,
    cat_name VARCHAR(25) NOT NULL,
    cat_color VARCHAR(7),
    bg_id INT NOT NULL,

    FOREIGN KEY (bg_id) REFERENCES budget_plan(bg_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.sub_category (
    sub_id SERIAL PRIMARY KEY,
    cat_id INT NOT NULL,
    sub_name VARCHAR(25) NOT NULL,
    sub_budget MONEY NOT NULL,

    FOREIGN KEY (cat_id) REFERENCES budget_category(cat_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.expenditure (
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