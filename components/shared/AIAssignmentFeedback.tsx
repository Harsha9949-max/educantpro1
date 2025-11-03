import React, { useState } from 'react';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import { getAIAssignmentFeedback } from '../../services/geminiService';

const AIAssignmentFeedback: React.FC = () => {
    const [subject, setSubject] = useState('General');
    const [assignmentText, setAssignmentText] = useState('');
    const [feedback, setFeedback] = useState<{ strengths: string; improvements: string; summary: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!assignmentText.trim()) return;
        setIsLoading(true);
        setFeedback(null);
        const result = await getAIAssignmentFeedback(subject, assignmentText);
        setFeedback(result);
        setIsLoading(false);
    };

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-gray-900">AI Assignment Feedback</h3>
            <div className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Subject</label>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    >
                        <option>General</option>
                        <option>Physics</option>
                        <option>Mathematics</option>
                        <option>History</option>
                        <option>Literature</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Paste Assignment Text</label>
                    <textarea
                        rows={8}
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your assignment text here..."
                    ></textarea>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !assignmentText.trim()}
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
                >
                    {isLoading ? <Spinner size="sm" /> : "Get Feedback"}
                </button>
            </div>
            {isLoading && (
                 <div className="mt-6 text-center">
                    <Spinner />
                    <p className="text-gray-500 mt-2">AI is analyzing your submission...</p>
                 </div>
            )}
            {feedback && (
                <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Feedback Analysis</h4>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-bold text-green-800">Strengths</h5>
                        <p className="text-sm text-green-700 whitespace-pre-wrap">{feedback.strengths}</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <h5 className="font-bold text-yellow-800">Areas for Improvement</h5>
                        <p className="text-sm text-yellow-700 whitespace-pre-wrap">{feedback.improvements}</p>
                    </div>
                     <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-bold text-blue-800">Overall Summary</h5>
                        <p className="text-sm text-blue-700 whitespace-pre-wrap">{feedback.summary}</p>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default AIAssignmentFeedback;