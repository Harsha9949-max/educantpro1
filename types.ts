
export enum Role {
  Student = 'student',
  Lecturer = 'lecturer',
  Parent = 'parent',
  Principal = 'principal',
  Admin = 'admin',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  status: 'Active' | 'Frozen';
}

export interface Notification {
  id: string;
  type: 'system' | 'security' | 'reward';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  completed: boolean;
}

// New types for Admin Dashboard
export enum VerificationStatus {
    Pending = 'Pending',
    LecturerVerified = 'Lecturer Verified',
    PrincipalVerified = 'Principal Verified',
    AdminApproved = 'Admin Approved',
    Rejected = 'Rejected',
}

export interface RewardRequest {
    id: string;
    studentName: string;
    reward: string;
    date: string;
    status: VerificationStatus;
    isFlagged: boolean; // For fraud detection
    verificationHistory: {
        role: Role;
        user: string;
        timestamp: string;
    }[];
}

export interface AuditLog {
    id: number;
    timestamp: string;
    user: string;
    role: Role;
    action: string;
    ip: string;
}
