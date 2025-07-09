import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'integrator' | 'viewer';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  getAllUsers: () => User[];
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@integrixlab.com',
    role: 'admin',
    permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'system_config'],
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15'
  },
  {
    id: '2',
    username: 'integrator1',
    email: 'integrator1@integrixlab.com',
    role: 'integrator',
    permissions: ['create', 'read', 'update', 'delete'],
    createdAt: '2024-01-02',
    lastLogin: '2024-01-14'
  },
  {
    id: '3',
    username: 'viewer1',
    email: 'viewer1@integrixlab.com',
    role: 'viewer',
    permissions: ['read'],
    createdAt: '2024-01-03',
    lastLogin: '2024-01-13'
  }
];

// Mock credentials
const mockCredentials = {
  'admin': 'admin123',
  'integrator1': 'integrator123',
  'viewer1': 'viewer123'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token on app start
    const token = localStorage.getItem('integrixlab_token');
    const storedUsername = localStorage.getItem('integrixlab_username');
    if (token && storedUsername) {
      const foundUser = mockUsers.find(u => u.username === storedUsername);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check against mock credentials
      if (mockCredentials[username as keyof typeof mockCredentials] === password) {
        const foundUser = mockUsers.find(u => u.username === username);
        if (foundUser) {
          const updatedUser = { ...foundUser, lastLogin: new Date().toISOString().split('T')[0] };
          
          const mockToken = `mock-jwt-token-${username}`;
          localStorage.setItem('integrixlab_token', mockToken);
          localStorage.setItem('integrixlab_username', username);
          setUser(updatedUser);
          navigate('/dashboard');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('integrixlab_token');
    localStorage.removeItem('integrixlab_username');
    setUser(null);
    navigate('/login');
  };

  const getAllUsers = () => {
    return users;
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};