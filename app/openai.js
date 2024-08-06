import { OpenAI } from 'openai';
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: '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',
    dangerouslyAllowBrowser: true
});


export async function fetchRecipes(ingredients) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that provides recipes based on ingredients.',
                },
                {
                    role: 'user',
                    content: `Here are my ingredients: ${ingredients.join(', ')}. List 3 recommendations for recipes you could make with these ingredients. 
                    Make sure to include the recipe names and ingredients in a concise format, formatted as HTML where possible. Leave out non recipe text 
                    like "sure here are three recipes" or "feel free to copy paste in HTML browser", just give recipes. Also please don't say html''' or ''' at 
                    the top/bottom of the output, only recipes.`,
                },
            ],
        });

        const recipes = response.choices[0].message.content;

        return recipes;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return 'Error fetching recipes. Please try again later.';
    }
}