const budgetModels = require('../database/budgetModels');


async function budgetRollOver() {
    // Gets all savings categories with their associated budgets and reset days.
    // rollover all categories where reset day is today.
    
    const today = new Date();
    const currentDay = today.getDate();

    try {
        const categories = await budgetModels.getAllSavings();
        categories.forEach(async (category) => {
            if (category.bg_budget_reset === currentDay) {
                try {
                    await budgetModels.addToSavings(category.sub_id, category.sub_budget);
                } catch (error) {
                    console.error(`Error adding to savings for category ${category.sub_id}:`, error);
                }
            }
        });
    } catch (error) {
        console.error('Error fetching savings categories for scheduled job:', error);
    }
}

module.exports = budgetRollOver;