import { Role, User } from '../types';
import { ROLES } from '../constants';

const users: User[] = [
    { id: 'usr_student1', name: 'Alice Johnson', role: ROLES.STUDENT, status: 'Active' },
    { id: 'usr_lecturer1', name: 'Dr. Robert Smith', role: ROLES.LECTURER, status: 'Active' },
    { id: 'usr_parent1', name: 'John Doe', role: ROLES.PARENT, status: 'Active' },
    { id: 'usr_principal1', name: 'Ms. Carol White', role: ROLES.PRINCIPAL, status: 'Active' },
    { id: 'usr_admin1', name: 'Admin User', role: ROLES.ADMIN, status: 'Active' },
];

// Map usernames (lowercase first name or 'admin') to users and passwords
// Changed: Fixed type assignments - removed undefined possibility
const credentials: Record<string, { user: User, pass: string }> = {
    'alice': { user: users[0]!, pass: 'student123' },
    'robert': { user: users[1]!, pass: 'lecturer123' },
    'john': { user: users[2]!, pass: 'parent123' },
    'carol': { user: users[3]!, pass: 'principal123' },
    'admin': { user: users[4]!, pass: 'password123' },
};

const parentConnectionCode = 'CHILD-ALICE-123';


export const authService = {
    login: (role: Role, username: string, password?: string, connectionCode?: string): Promise<User | null> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const creds = credentials[username.toLowerCase()];
                
                if (!creds || creds.user.role !== role || creds.pass !== password) {
                    resolve(null);
                    return;
                }

                if (role === ROLES.PARENT && connectionCode !== parentConnectionCode) {
                    resolve(null);
                    return;
                }

                resolve(creds.user);

            }, 1000);
        });
    },
    logout: (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    },
};