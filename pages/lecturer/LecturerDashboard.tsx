import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import AIAssignmentFeedback from '../../components/shared/AIAssignmentFeedback';
import { useSocket } from '../../hooks/useSocket';
import { generateQuestionPaper } from '../../services/geminiService';

// AI Question Paper Generator
const AIQuestionPaperGenerator = () => {
    const [subject, setSubject] = useState('');
    const [topics, setTopics] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [paper, setPaper] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!subject || !topics) return;
        setIsLoading(true);
        setPaper(null);
        const result = await generateQuestionPaper(subject, topics, difficulty);
        setPaper(result);
        setIsLoading(false);
    };

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">AI Question Paper Generator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject (e.g., Physics)" className="p-2 border rounded"/>
                <input type="text" value={topics} onChange={e => setTopics(e.target.value)} placeholder="Topics (comma-separated)" className="p-2 border rounded"/>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="p-2 border rounded">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </select>
            </div>
            <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-primary-600 text-white p-2 rounded disabled:opacity-50">
                {isLoading ? <Spinner size="sm" /> : 'Generate Paper'}
            </button>
            {isLoading && <div className="text-center mt-4"><p>Generating question paper... this may take a moment.</p></div>}
            {paper && paper.error && <p className="text-red-500 mt-4">{paper.error}</p>}
            {paper && !paper.error && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="text-lg font-bold">Generated Paper: {subject}</h4>
                    <div className="mt-4">
                        <h5 className="font-semibold">Multiple Choice Questions</h5>
                        <ul className="list-decimal list-inside space-y-4 mt-2">
                            {paper.multipleChoiceQuestions.map((q: any, i: number) => (
                                <li key={i}>
                                    <p>{q.question}</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {q.options.map((opt: string, j: number) => <li key={j} className={j === q.answerIndex ? 'font-bold text-green-600' : ''}>{opt}</li>)}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h5 className="font-semibold">Short Answer Questions</h5>
                        <ul className="list-decimal list-inside space-y-4 mt-2">
                            {paper.shortAnswerQuestions.map((q: any, i: number) => (
                                <li key={i}>
                                    <p>{q.question}</p>
                                    <p className="text-sm text-blue-600"><strong>Answer:</strong> {q.answer}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </Card>
    );
}

// Reward Verification
const RewardVerification = () => {
    const [requests, setRequests] = useState([
        { id: 1, student: 'Alice Johnson', reward: '60-Day Attendance Streak' },
        { id: 2, student: 'Bob Williams', reward: 'Top Performer - Physics' },
    ]);
    const { socket } = useSocket();

    const handleVerify = (id: number) => {
        const verifiedRequest = requests.find(r => r.id === id);
        if (socket && verifiedRequest) {
            socket.emit('reward_verified', { ...verifiedRequest, lecturer: 'You', timestamp: new Date().toISOString() });
        }
        setRequests(requests.filter(r => r.id !== id));
    };

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Reward Verification</h3>
            <div className="space-y-3">
                {requests.length > 0 ? requests.map(req => (
                    <div key={req.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                        <div>
                            <p className="font-semibold">{req.student}</p>
                            <p className="text-sm text-gray-500">{req.reward}</p>
                        </div>
                        <button onClick={() => handleVerify(req.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Verify</button>
                    </div>
                )) : <p className="text-gray-500">No pending verifications.</p>}
            </div>
        </Card>
    )
}

// Student Query Management
const StudentQueryManagement = () => {
    const [pending, setPending] = useState([
        { id: 1, student: 'Charlie Brown', query: 'I am having trouble with Newton\'s third law. Can you provide more examples?' },
    ]);
    const [resolved, setResolved] = useState([
        { id: 2, student: 'Diana Miller', query: 'What is the due date for the next assignment?' },
    ]);

    const handleResolve = (id: number) => {
        const queryToMove = pending.find(q => q.id === id);
        if (queryToMove) {
            setResolved(prev => [queryToMove, ...prev]);
            setPending(prev => prev.filter(q => q.id !== id));
        }
    };
    
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Student Query Management</h3>
            <div>
                <h4 className="font-semibold mb-2">Pending</h4>
                <div className="space-y-2">
                    {pending.map(q => (
                        <details key={q.id} className="p-3 bg-yellow-50 rounded-lg">
                            <summary className="font-semibold cursor-pointer">{q.student}</summary>
                            <p className="mt-2 text-sm text-gray-600">{q.query}</p>
                            <button onClick={() => handleResolve(q.id)} className="text-sm bg-blue-500 text-white px-2 py-1 mt-2 rounded hover:bg-blue-600">Mark as Resolved</button>
                        </details>
                    ))}
                    {pending.length === 0 && <p className="text-sm text-gray-500">No pending queries.</p>}
                </div>
            </div>
            <div className="mt-6">
                <h4 className="font-semibold mb-2">Resolved</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {resolved.map(q => (
                         <details key={q.id} className="p-3 bg-green-50 rounded-lg">
                             <summary className="font-semibold cursor-pointer">{q.student}</summary>
                             <p className="mt-2 text-sm text-gray-600">{q.query}</p>
                         </details>
                    ))}
                </div>
            </div>
        </Card>
    );
};

// AI Feedback Monitor
const AIFeedbackMonitor = () => {
    const submissions = [
        { id: 1, student: 'Eva Green', text: 'The industrial revolution was a period of major industrialization...', feedback: { strengths: 'Good structure.', improvements: 'More specific examples needed.', summary: 'A solid start.'} },
        { id: 2, student: 'Frank White', text: 'Photosynthesis is the process used by plants to convert light energy...', feedback: { strengths: 'Clear explanation.', improvements: 'Could add a diagram.', summary: 'Well written.'} },
    ];
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">AI Feedback Monitor</h3>
            <div className="space-y-2">
                {submissions.map(s => (
                    <details key={s.id} className="p-3 bg-gray-100 rounded-lg">
                        <summary className="font-semibold cursor-pointer">Submission from {s.student}</summary>
                        <div className="grid grid-cols-2 gap-4 mt-2 border-t pt-2">
                            <div>
                                <h5 className="font-bold text-sm">Student Text</h5>
                                <p className="text-xs text-gray-600 italic">"{s.text}"</p>
                            </div>
                            <div>
                                <h5 className="font-bold text-sm">AI Feedback</h5>
                                <p className="text-xs text-green-600">Strengths: {s.feedback.strengths}</p>
                                <p className="text-xs text-yellow-600">Improvements: {s.feedback.improvements}</p>
                                <p className="text-xs text-blue-600">Summary: {s.feedback.summary}</p>
                            </div>
                        </div>
                    </details>
                ))}
            </div>
        </Card>
    )
}

const LecturerDashboard = () => {
  return (
    <div className="p-4 space-y-8">
      <AIQuestionPaperGenerator />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RewardVerification />
        <div className="lg:col-span-2">
            <StudentQueryManagement />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AIFeedbackMonitor />
        <div>
            <Card>
                <h3 className="text-xl font-bold mb-4">QR Code Attendance</h3>
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">QR Code generation functionality will be available here.</p>
                </div>
            </Card>
            <div className="mt-8">
                <AIAssignmentFeedback />
            </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;