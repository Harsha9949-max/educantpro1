import React, { useState, useRef } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import AIAssignmentFeedback from '../../components/shared/AIAssignmentFeedback';
import { SyllabusTopic } from '../../types';
import { getAIStudyBuddyResponse } from '../../services/geminiService';

// AI Study Buddy Component
const AIStudyBuddy: React.FC = () => {
    const [subject, setSubject] = useState('Physics');
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState<{ user: string; ai: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!question.trim()) return;
        setIsLoading(true);
        const userQuestion = question;
        setQuestion('');
        const aiResponse = await getAIStudyBuddyResponse(subject, userQuestion);
        setChatHistory(prev => [...prev, { user: userQuestion, ai: aiResponse }]);
        setIsLoading(false);
    };

    return (
        <Card className="flex flex-col h-[500px]">
            <h3 className="text-xl font-bold mb-4">AI Study Buddy</h3>
            <div className="flex items-center mb-4">
                <label className="mr-2 text-sm font-medium">Subject:</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                    <option>Physics</option>
                    <option>Math</option>
                    <option>History</option>
                </select>
            </div>
            <div className="flex-grow overflow-y-auto p-4 bg-gray-100 rounded-lg mb-4">
                {chatHistory.length === 0 && <p className="text-center text-gray-500">Ask a question to get started!</p>}
                {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-2 mb-4">
                        <div className="text-right"><span className="bg-blue-200 p-2 rounded-lg inline-block">{chat.user}</span></div>
                        <div><span className="bg-gray-200 p-2 rounded-lg inline-block whitespace-pre-wrap">{chat.ai}</span></div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center space-x-2">
                         <span className="bg-gray-200 p-2 rounded-lg inline-block">Thinking...</span>
                         <Spinner size="sm" />
                    </div>
                )}
            </div>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    className="flex-grow p-2.5 bg-gray-50 border border-gray-300 rounded-lg"
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-primary-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">Send</button>
            </div>
        </Card>
    );
};

// Reward Status Tracker Component
const RewardStatusTracker: React.FC = () => {
    const steps = [
        { name: 'Enrollment', status: 'completed' },
        { name: '30-Day Streak', status: 'completed' },
        { name: '60-Day Streak', status: 'pending' },
        { name: '90-Day Streak', status: 'future' },
        { name: 'Final Reward', status: 'future' },
    ];
    
    return (
        <Card>
            <h3 className="text-xl font-bold mb-6">Reward Status: 60-Day Streak</h3>
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${step.status === 'completed' ? 'bg-green-500' : step.status === 'pending' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}>
                                {step.status === 'completed' ? '✓' : index + 1}
                            </div>
                            <p className="text-xs mt-2 text-center">{step.name}</p>
                        </div>
                        {index < steps.length - 1 && <div className={`flex-auto border-t-2 ${step.status === 'completed' ? 'border-green-500' : 'border-gray-400'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </Card>
    );
};


// Syllabus Tracker Component
const initialTopics: SyllabusTopic[] = [
    { id: '1', title: 'Introduction to Physics', completed: true },
    { id: '2', title: 'Kinematics', completed: true },
    { id: '3', title: 'Newton\'s Laws of Motion', completed: false },
    { id: '4', title: 'Work, Energy, and Power', completed: false },
    { id: '5', title: 'Thermodynamics', completed: false },
];

const SyllabusTracker: React.FC = () => {
    const [topics, setTopics] = useState(initialTopics);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const toggleCompletion = (id: string) => {
        setTopics(topics.map(topic => topic.id === id ? { ...topic, completed: !topic.completed } : topic));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragItem.current = position;
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragOverItem.current = position;
    };

    const handleDrop = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const newTopics = [...topics];
        const dragItemContent = newTopics[dragItem.current];
        newTopics.splice(dragItem.current, 1);
        newTopics.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setTopics(newTopics);
    };

    const completedCount = topics.filter(t => t.completed).length;
    const progress = (completedCount / topics.length) * 100;

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Syllabus Tracker: Physics</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{completedCount} of {topics.length} topics completed ({Math.round(progress)}%)</p>
            <div className="space-y-2">
                {topics.map((topic, index) => (
                    <div
                        key={topic.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-grab ${topic.completed ? 'bg-green-100' : 'bg-gray-100'}`}
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={topic.completed}
                                onChange={() => toggleCompletion(topic.id)}
                                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className={`ml-3 ${topic.completed ? 'line-through text-gray-500' : ''}`}>{topic.title}</span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// Raise a Query Component
const RaiseQuery: React.FC = () => {
    const [lecturer, setLecturer] = useState('Dr. Smith');
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setQuery('');
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1500);
    };

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Raise a Query</h3>
            <div className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium">Lecturer</label>
                    <select value={lecturer} onChange={e => setLecturer(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg">
                        <option>Dr. Smith (Physics)</option>
                        <option>Mrs. Davis (Math)</option>
                        <option>Mr. Brown (History)</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium">Your Question</label>
                    <textarea value={query} onChange={e => setQuery(e.target.value)} rows={4} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg"></textarea>
                </div>
                <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                    {isLoading ? <Spinner size="sm" /> : 'Submit Query'}
                </button>
                {isSuccess && <p className="text-green-500 text-sm text-center">Query sent successfully!</p>}
            </div>
        </Card>
    );
};


const StudentDashboard: React.FC = () => {
    const statCards = [
        { title: 'Attendance Streak', value: '58 Days', icon: '🔥' },
        { title: 'Overall Grade', value: 'A-', icon: '📊' },
        { title: 'AI Questions Asked', value: '127', icon: '🤖' },
        { title: 'Syllabus Progress', value: '40%', icon: '📈' },
    ];
    
    return (
        <div className="p-4 space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(card => (
                    <Card key={card.title} className="flex items-center space-x-4">
                        <div className="text-4xl">{card.icon}</div>
                        <div>
                            <p className="text-gray-500">{card.title}</p>
                            <p className="text-2xl font-bold">{card.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AIStudyBuddy />
                </div>
                <div className="space-y-8">
                    <RewardStatusTracker />
                    <SyllabusTracker />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RaiseQuery />
                <AIAssignmentFeedback />
            </div>
        </div>
    );
};

export default StudentDashboard;