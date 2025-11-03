import React, { useState } from 'react';
import Card from '../../components/ui/Card';

const parentData = {
    children: [
        {
            id: 1, name: 'Alice Johnson',
            stats: { grade: 'A-', attendance: '98%', gradedAssignments: 8, syllabusProgress: '40%' },
            grades: [{ assignment: 'Physics HW 1', score: '95%' }, { assignment: 'Math Quiz 2', score: '88%' }],
            activity: ['Completed "Kinematics"', 'Asked a question in Physics', 'Submitted Math Quiz 2'],
        },
        {
            id: 2, name: 'Alex Johnson',
            stats: { grade: 'B+', attendance: '95%', gradedAssignments: 6, syllabusProgress: '60%' },
            grades: [{ assignment: 'History Essay', score: '85%' }, { assignment: 'Algebra Test', score: '91%' }],
            activity: ['Completed "World War II"', 'Submitted History Essay', 'Started "Linear Equations"'],
        }
    ]
};

const ParentDashboard = () => {
    const [selectedChildIndex, setSelectedChildIndex] = useState(0);
    const child = parentData.children[selectedChildIndex];

    // Changed: Added null check for child before creating statCards
    if (!child) {
        return <div>No child data available</div>;
    }

    const statCards = [
        { title: 'Overall Grade', value: child.stats.grade, icon: '📊' },
        { title: 'Attendance', value: child.stats.attendance, icon: '👍' },
        { title: 'Graded Assignments', value: child.stats.gradedAssignments, icon: '📝' },
        { title: 'Syllabus Progress', value: child.stats.syllabusProgress, icon: '📈' },
    ];

    return (
        <div className="p-4 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Parent Dashboard</h2>
                <div className="flex space-x-2">
                    {parentData.children.map((c, index) => (
                        <button key={c.id} onClick={() => setSelectedChildIndex(index)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${index === selectedChildIndex ? 'bg-primary-600 text-white' : 'bg-white'}`}>
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-bold mb-4">Recent Grades</h3>
                    <div className="space-y-3">
                        {child.grades.map((grade, i) => (
                            <div key={i} className="flex justify-between p-3 bg-gray-100 rounded-lg">
                                <p>{grade.assignment}</p>
                                <p className="font-bold">{grade.score}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {child.activity.map((act, i) => <li key={i}>{act}</li>)}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default ParentDashboard;