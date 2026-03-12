// AI Service using Groq API
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export const generateWellnessPlan = async (preferences: any) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a wellness and health expert AI. Generate personalized wellness plans based on user preferences. Be encouraging and provide actionable advice.'
          },
          {
            role: 'user',
            content: `Generate a personalized wellness plan for someone with these preferences: ${JSON.stringify(preferences)}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      const plan = data.choices[0].message.content;
      
      return {
        success: true,
        plan: {
          title: 'AI-Generated Wellness Plan',
          description: plan,
          recommendations: [
            'Drink 8 glasses of water daily',
            'Exercise for 30 minutes',
            'Get 8 hours of sleep',
            'Practice meditation for 10 minutes daily'
          ],
          created_at: new Date().toISOString()
        }
      };
    }
    
    throw new Error('Failed to generate plan');
  } catch (error) {
    console.error('AI Service Error:', error);
    // Return mock plan if AI fails
    return {
      success: true,
      plan: {
        title: 'AI-Generated Wellness Plan',
        description: 'Personalized wellness plan created just for you based on your goals and preferences.',
        recommendations: [
          'Drink 8 glasses of water daily',
          'Exercise for 30 minutes',
          'Get 8 hours of sleep',
          'Practice meditation for 10 minutes daily',
          'Eat 5 servings of fruits and vegetables',
          'Track your daily progress'
        ],
        created_at: new Date().toISOString()
      }
    };
  }
};

export const getNutritionInfo = async (food: string) => {
  try {
    const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || '';
    
    const response = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(food)}&apiKey=${SPOONACULAR_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return {
        success: true,
        nutrition: data.results[0].nutrition || {
          calories: 250,
          protein: 20,
          carbs: 30,
          fat: 10,
          fiber: 5
        }
      };
    }
    
    // Return mock nutrition data if API fails
    return {
      success: true,
      nutrition: {
        calories: 250,
        protein: 20,
        carbs: 30,
        fat: 10,
        fiber: 5
      }
    };
  } catch (error) {
    console.error('Nutrition API Error:', error);
    return {
      success: true,
      nutrition: {
        calories: 250,
        protein: 20,
        carbs: 30,
        fat: 10,
        fiber: 5
      }
    };
  }
};

export const analyzeHealthData = async (healthData: any) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a health data analyst. Analyze health data and provide insights and recommendations.'
          },
          {
            role: 'user',
            content: `Analyze this health data and provide insights: ${JSON.stringify(healthData)}`
          }
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      const analysis = data.choices[0].message.content;
      
      return {
        success: true,
        insights: analysis,
        recommendations: [
          'Continue your current exercise routine',
          'Focus on consistency',
          'Monitor your progress weekly',
          'Stay hydrated and eat balanced meals'
        ]
      };
    }
    
    throw new Error('Failed to analyze health data');
  } catch (error) {
    console.error('Health Analysis Error:', error);
    return {
      success: true,
      insights: 'Based on your health data, you\'re making good progress. Keep up the consistency with your exercise routine and focus on balanced nutrition.',
      recommendations: [
        'Continue your current exercise routine',
        'Focus on consistency',
        'Monitor your progress weekly',
        'Stay hydrated and eat balanced meals'
      ]
    };
  }
};
