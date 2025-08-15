SELECT 
    bp.bg_budget_reset,
    sc.sub_id,
    sc.sub_budget
FROM budget_plan bp
INNER JOIN budget_category bc ON bp.bg_id = bc.bg_id
INNER JOIN sub_category sc ON bc.cat_id = sc.cat_id
INNER JOIN savings s ON sc.sub_id = s.sub_id;
