// Mock implementation for Gemini service
// This prevents errors if API key is not set

const API_KEY = typeof window !== 'undefined' 
  ? (window as any).GEMINI_API_KEY 
  : process.env.GEMINI_API_KEY;

export async function getAIStudyBuddyResponse(subject: string, question: string): Promise<string> {
  // Check if API key exists
  if (!API_KEY) {
    return "AI Study Buddy is currently unavailable. Please configure the Gemini API key to enable this feature.";
  }

  try {
    // Simulated response for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would make actual API calls to Gemini
    const responses: Record<string, string> = {
      'physics': `For your ${subject} question: "${question}"\n\nHere's a helpful explanation:\n\nPhysics concepts often involve understanding fundamental principles. Let me break this down for you...\n\n[This is a demo response. Configure Gemini API for actual AI responses.]`,
      'math': `For your ${subject} question: "${question}"\n\nLet's solve this step by step:\n\n1. First, identify what we're looking for\n2. Apply the relevant formula or concept\n3. Work through the calculation\n\n[This is a demo response. Configure Gemini API for actual AI responses.]`,
      'history': `For your ${subject} question: "${question}"\n\nHistorical context is important here:\n\nThe key events and dates to remember are...\n\n[This is a demo response. Configure Gemini API for actual AI responses.]`
    };

    const subjectKey = subject.toLowerCase();
    return responses[subjectKey] || `I'll help you with your ${subject} question: "${question}"\n\n[This is a demo response. Configure Gemini API for actual AI responses.]`;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return "Sorry, I'm having trouble processing your question right now. Please try again later.";
  }
}

export async function generateQuestionPaper(
  subject: string, 
  topics: string, 
  difficulty: string
): Promise<any> {
  if (!API_KEY) {
    return {
      error: "Question paper generation is unavailable. Please configure the Gemini API key."
    };
  }

  try {
    // Simulated response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      multipleChoiceQuestions: [
        {
          question: `Sample ${subject} question about ${topics} (${difficulty} level)?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          answerIndex: 1
        },
        {
          question: `Another ${subject} question on ${topics}?`,
          options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
          answerIndex: 2
        }
      ],
      shortAnswerQuestions: [
        {
          question: `Explain the concept of ${topics} in ${subject}.`,
          answer: `This is a sample answer about ${topics} in ${subject} at ${difficulty} difficulty level.`
        },
        {
          question: `What are the key principles of ${topics}?`,
          answer: `The key principles include... [This is a demo response]`
        }
      ]
    };
  } catch (error) {
    console.error('Error generating question paper:', error);
    return {
      error: "Failed to generate question paper. Please try again."
    };
  }
}

export async function getAssignmentFeedback(text: string): Promise<any> {
  if (!API_KEY) {
    return {
      strengths: "Unable to analyze - API key not configured",
      improvements: "Please configure Gemini API key",
      summary: "Service unavailable"
    };
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      strengths: "Good structure and clear presentation of ideas. The arguments are well-organized.",
      improvements: "Consider adding more specific examples and citations to support your points.",
      summary: "This is a solid piece of work that demonstrates good understanding of the topic."
    };
  } catch (error) {
    console.error('Error getting feedback:', error);
    return {
      strengths: "Unable to analyze",
      improvements: "Service temporarily unavailable",
      summary: "Please try again later"
    };
  }
}