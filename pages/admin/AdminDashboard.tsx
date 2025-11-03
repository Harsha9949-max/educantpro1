
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useSystemStatus } from '../../hooks/useSystemStatus';
import { Role, User, RewardRequest, VerificationStatus, AuditLog } from '../../types';
import Card from '../../components/ui/Card';

// --- MOCK DATA ---
const mockUsers: User[] = [
    { id: 'usr_student1', name: 'Alice Johnson', role: Role.Student, status: 'Active' },
    { id: 'usr_lecturer1', name: 'Dr. Robert Smith', role: Role.Lecturer, status: 'Active' },
    { id: 'usr_principal1', name: 'Ms. Carol White', role: Role.Principal, status: 'Active' },
    { id: 'usr_student2', name: 'Bob Williams', role: Role.Student, status: 'Frozen' },
    { id: 'usr_student3', name: 'Charlie Brown', role: Role.Student, status: 'Active' },
];

const initialRewardRequests: RewardRequest[] = [
    {
        id: 'rew_001', studentName: 'Alice Johnson', reward: '90-Day Perfect Attendance', date: new Date(Date.now() - 86400000).toISOString(),
        status: VerificationStatus.PrincipalVerified, isFlagged: false,
        verificationHistory: [
            { role: Role.Lecturer, user: 'Dr. Robert Smith', timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
            { role: Role.Principal, user: 'Ms. Carol White', timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
        ]
    },
    {
        id: 'rew_002', studentName: 'Charlie Brown', reward: 'Top Scorer in Physics', date: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: VerificationStatus.LecturerVerified, isFlagged: true,
        verificationHistory: [
            { role: Role.Lecturer, user: 'Dr. Robert Smith', timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
        ]
    },
     {
        id: 'rew_003', studentName: 'Diana Miller', reward: 'Science Fair Winner', date: new Date(Date.now() - 5 * 86400000).toISOString(),
        status: VerificationStatus.AdminApproved, isFlagged: false,
        verificationHistory: [
            { role: Role.Lecturer, user: 'Dr. Robert Smith', timestamp: new Date(Date.now() - 7 * 86400000).toISOString() },
            { role: Role.Principal, user: 'Ms. Carol White', timestamp: new Date(Date.now() - 6 * 86400000).toISOString() },
        ]
    },
];

const mockAuditLogs: AuditLog[] = [
    { id: 1, timestamp: new Date().toISOString(), user: 'Admin User', role: Role.Admin, action: 'Approved reward "Science Fair Winner" for Diana Miller.', ip: '127.0.0.1' },
    { id: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Ms. Carol White', role: Role.Principal, action: 'Verified reward for Alice Johnson.', ip: '192.168.1.10' },
    { id: 3, timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), user: 'Dr. Robert Smith', role: Role.Lecturer, action: 'Verified reward for Charlie Brown.', ip: '192.168.1.5' },
    { id: 4, timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), user: 'Admin User', role: Role.Admin, action: 'Froze account for Bob Williams', ip: '127.0.0.1' },
    { id: 5, timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), user: 'Alice Johnson', role: Role.Student, action: 'Submitted assignment "Physics Homework 3".', ip: '203.0.113.25' },
];

// --- SVG ICONS ---
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const CpuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l-1.414-1.414M19.778 5.636l-1.414 1.414M18.364 18.364l1.414 1.414M4.222 18.364l1.414-1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;

// --- REUSABLE COMPONENTS ---
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <Card className="flex items-center p-4">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </Card>
);

// --- TAB COMPONENTS ---
const DashboardTab = () => {
    const { socket } = useSocket();
    const [activities, setActivities] = useState<any[]>([]);

    const handleNewActivity = useCallback((data: any) => {
        setActivities(prev => [data, ...prev].slice(0, 10));
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('new_activity', handleNewActivity);
            return () => {
                socket.off('new_activity', handleNewActivity);
            };
        }
    }, [socket, handleNewActivity]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Live Users" value="153" icon={<UsersIcon />} color="bg-blue-500" />
            <StatCard title="System Health" value="Healthy" icon={<CheckCircleIcon />} color="bg-green-500" />
            <StatCard title="Security Incidents" value="0" icon={<AlertTriangleIcon />} color="bg-yellow-500" />
            <StatCard title="Resource Utilization" value="45%" icon={<CpuIcon />} color="bg-purple-500" />
            <div className="md:col-span-2 lg:col-span-4">
                <Card>
                    <h3 className="font-bold mb-4">Real-Time Activity Feed</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {activities.length > 0 ? activities.map((act, i) => (
                             <div key={i} className="text-sm p-2 bg-gray-100 rounded animate-fade-in-down">
                                <strong>{act.user}</strong> ({act.role}): {act.action}
                            </div>
                        )) : <p className="text-gray-500">Listening for live events...</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
}

const UserManagementTab = () => {
    const [users, setUsers] = useState(mockUsers);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                 <Card>
                    <h3 className="font-bold mb-4">User Accounts</h3>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">Name</th><th>Role</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-2">{user.name}</td>
                                    <td>{user.role}</td>
                                    <td><span className={`px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span></td>
                                    <td className="space-x-1">
                                        <button className="text-blue-600 hover:underline">Edit</button>
                                        <button className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
            <div>
                 <Card>
                    <h3 className="font-bold mb-4">Permission Matrix</h3>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100"><tr><th className="p-2">Role</th><th>Permissions</th></tr></thead>
                        <tbody>
                            <tr className="border-b"><td className="p-2 font-semibold">Admin</td><td>All</td></tr>
                            <tr className="border-b"><td className="p-2 font-semibold">Principal</td><td>View Analytics, Verify Rewards</td></tr>
                            <tr className="border-b"><td className="p-2 font-semibold">Lecturer</td><td>Manage Students, Verify Rewards</td></tr>
                            <tr className="border-b"><td className="p-2 font-semibold">Student</td><td>View Syllabus, Use AI Tools</td></tr>
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
}

const RewardsTab = () => {
    const [requests, setRequests] = useState(initialRewardRequests);

    const handleApproval = (id: string, newStatus: VerificationStatus) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
    
    const VerificationStep: React.FC<{ name: string, done: boolean }> = ({ name, done }) => (
        <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${done ? 'bg-green-500' : 'bg-gray-400'}`}>
                {done && '✓'}
            </div>
            <span className={`ml-2 text-xs ${done ? 'text-gray-800' : 'text-gray-500'}`}>{name}</span>
        </div>
    );

    const pendingRequests = requests.filter(r => ![VerificationStatus.AdminApproved, VerificationStatus.Rejected].includes(r.status));
    const completedRequests = requests.filter(r => [VerificationStatus.AdminApproved, VerificationStatus.Rejected].includes(r.status));
    
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Pending Final Approval</h2>
            <div className="space-y-4">
                 {pendingRequests.map(req => (
                    <Card key={req.id}>
                        <div className="flex justify-between items-start">
                           <div>
                                <p className="font-bold">{req.studentName} - <span className="font-normal">{req.reward}</span></p>
                                <p className="text-xs text-gray-500">Submitted: {new Date(req.date).toLocaleDateString()}</p>
                           </div>
                           {req.isFlagged && <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold flex items-center"><AlertTriangleIcon/> <span className="ml-1">Fraud Detection Flag</span></div>}
                        </div>

                        <div className="my-4">
                            <h4 className="text-sm font-semibold mb-2">Three-Tier Verification Status</h4>
                             <div className="flex items-center space-x-2">
                                <VerificationStep name="Student" done={true} />
                                <div className="flex-auto border-t-2 border-green-500"></div>
                                <VerificationStep name="Lecturer" done={[VerificationStatus.LecturerVerified, VerificationStatus.PrincipalVerified].includes(req.status)} />
                                <div className={`flex-auto border-t-2 ${[VerificationStatus.LecturerVerified, VerificationStatus.PrincipalVerified].includes(req.status) ? 'border-green-500' : 'border-gray-400'}`}></div>
                                <VerificationStep name="Principal" done={req.status === VerificationStatus.PrincipalVerified} />
                                <div className={`flex-auto border-t-2 ${req.status === VerificationStatus.PrincipalVerified ? 'border-green-500' : 'border-gray-400'}`}></div>
                                <div className="flex items-center"><div className="w-6 h-6 rounded-full flex items-center justify-center text-white bg-blue-500 animate-pulse font-bold">A</div> <span className="ml-2 text-xs text-blue-700 font-bold">ADMIN FINAL</span></div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 border-t pt-2 mt-2">
                            <button onClick={() => handleApproval(req.id, VerificationStatus.Rejected)} className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Reject</button>
                            <button onClick={() => handleApproval(req.id, VerificationStatus.AdminApproved)} className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Finalize Reward</button>
                        </div>
                    </Card>
                 ))}
                 {pendingRequests.length === 0 && <p className="text-gray-500">No rewards awaiting final approval.</p>}
            </div>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Completed Requests</h2>
            <Card>
                <ul className="divide-y">
                    {completedRequests.map(req => (
                        <li key={req.id} className="py-2 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{req.studentName}</p>
                                <p className="text-sm text-gray-500">{req.reward}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${req.status === VerificationStatus.AdminApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{req.status}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

const SystemControlsTab = () => {
    const { isMaintenanceMode, setMaintenanceMode } = useSystemStatus();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h3 className="font-bold mb-4">System Health</h3>
                <div className="space-y-2">
                    <button className="w-full p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Optimize Database</button>
                    <button className="w-full p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Clear System Cache</button>
                </div>
            </Card>
            <Card>
                <h3 className="font-bold mb-4">Data Governance</h3>
                 <div className="space-y-2">
                    <button className="w-full p-2 text-sm bg-green-500 text-white rounded hover:bg-green-600">Trigger Full Backup</button>
                    <button className="w-full p-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Initiate Recovery</button>
                </div>
            </Card>
            <Card className="md:col-span-2">
                 <h3 className="font-bold mb-4">Platform Controls</h3>
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <p className="font-semibold">Maintenance Mode</p>
                        <p className="text-xs text-gray-500">Temporarily disable non-admin access for system updates.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isMaintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                </div>
            </Card>
        </div>
    );
};

const AuditLogsTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredLogs = useMemo(() =>
        mockAuditLogs.filter(log =>
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ip.includes(searchTerm)
        ), [searchTerm]
    );

    return (
        <Card>
            <h3 className="font-bold mb-4">Transaction & Audit Logging</h3>
            <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            />
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 sticky top-0"><tr>
                        <th className="p-2">Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>IP Address</th>
                    </tr></thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id} className="border-b">
                                <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.user}</td>
                                <td>{log.role}</td>
                                <td>{log.action}</td>
                                <td>{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};


const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const tabs = [
        { id: 'dashboard', label: 'Real-Time Dashboard' },
        { id: 'users', label: 'User Management' },
        { id: 'rewards', label: 'Reward Approval' },
        { id: 'controls', label: 'System Controls' },
        { id: 'audit', label: 'Audit Logs' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardTab />;
            case 'users': return <UserManagementTab />;
            case 'rewards': return <RewardsTab />;
            case 'controls': return <SystemControlsTab />;
            case 'audit': return <AuditLogsTab />;
            default: return null;
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                    {tabs.map(tab => (
                         <li key={tab.id} className="mr-2">
                            <button onClick={() => setActiveTab(tab.id)} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}>
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>{renderTabContent()}</div>
        </div>
    );
};

export default AdminDashboard;