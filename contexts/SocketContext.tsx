import React, { createContext, useEffect, ReactNode, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Mock Socket Server
class MockSocket {
    private listeners: { [key: string]: ((...args: any[]) => void)[] } = {};
    private interval: number | null = null;

    constructor() {
        this.interval = window.setInterval(() => {
            const randomEvent = Math.random();
            if (randomEvent < 0.5) {
                this.emit('new_activity', {
                    user: 'Jane Doe',
                    role: 'Student',
                    action: `Completed 'Algebra Basics'`,
                    timestamp: new Date().toISOString(),
                });
            } else {
                this.emit('reward_verified', {
                    student: 'Alice Johnson',
                    reward: '60-Day Attendance Streak',
                    lecturer: 'Dr. Smith',
                    timestamp: new Date().toISOString(),
                });
            }
        }, 8000);
    }

    on(event: string, callback: (...args: any[]) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event: string, ...args: any[]) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(...args));
        }
    }
    
    disconnect() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      console.log("Mock socket disconnected");
    }

    // Fix: Add 'off' method to allow for proper listener cleanup.
    off(event: string, callback: (...args: any[]) => void) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(
                (listener) => listener !== callback
            );
        }
    }
}

interface SocketContextType {
    socket: MockSocket | null;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<MockSocket | null>(null);

    useEffect(() => {
        const newSocket = new MockSocket();
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
