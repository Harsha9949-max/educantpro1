
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAIStudyBuddyResponse = async (subject: string, question: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert tutor in ${subject}. Explain the following concept simply: ${question}`,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting AI study buddy response:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};

export const getAIAssignmentFeedback = async (subject: string, assignmentText: string): Promise<{ strengths: string; improvements: string; summary: string; }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `As an expert in ${subject}, analyze the following student assignment text. Provide constructive feedback. Structure your response in JSON format with three keys: "strengths", "improvements", and "summary".\n\nAssignment:\n${assignmentText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                strengths: { type: Type.STRING },
                improvements: { type: Type.STRING },
                summary: { type: Type.STRING }
            },
            required: ["strengths", "improvements", "summary"]
        }
      }
    });

    const parsed = JSON.parse(response.text);
    return parsed;
  } catch (error) {
    console.error("Error getting AI assignment feedback:", error);
    return {
        strengths: "Could not analyze strengths due to an error.",
        improvements: "Could not analyze areas for improvement due to an error.",
        summary: "Failed to generate a summary. Please check the input and try again."
    };
  }
};

export const generateQuestionPaper = async (subject: string, topics: string, difficulty: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Generate a question paper for the subject "${subject}". Cover these topics: ${topics}. The difficulty level should be ${difficulty}. The paper should have two sections: "multipleChoiceQuestions" (5 questions) and "shortAnswerQuestions" (3 questions). For MCQs, provide 4 options and the correct answer index. For short answer questions, provide the question and a model answer.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        multipleChoiceQuestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    answerIndex: { type: Type.INTEGER }
                                },
                                required: ["question", "options", "answerIndex"]
                            }
                        },
                        shortAnswerQuestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    answer: { type: Type.STRING }
                                },
                                required: ["question", "answer"]
                            }
                        }
                    },
                    required: ["multipleChoiceQuestions", "shortAnswerQuestions"]
                }
            }
        });

        return JSON.parse(response.text);

    } catch (error) {
        console.error("Error generating question paper:", error);
        return { error: "Failed to generate question paper. Please try again." };
    }
}
