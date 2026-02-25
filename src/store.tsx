import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, isSunday } from 'date-fns';

export type UserProfile = {
  id: string;
  email: string;
  password?: string; // Stored locally for simulation
  name: string;
  role: 'admin' | 'manager' | 'monitor' | null;
  routeId?: string;
};

export type Route = {
  id: string;
  name: string;
  driver: string;
  driverPhone: string;
  monitorName: string;
  monitorPhone: string;
};

export type Student = {
  id: string;
  name: string;
  address: string;
  class: string;
  school: string;
  routeId: string;
  contact1Name: string;
  contact1Phone: string;
  contact2Name: string;
  contact2Phone: string;
  createdAt?: string;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  boarding: boolean;
  alighting: boolean;
  boardingTime?: string;
  alightingTime?: string;
};

export type Incident = {
  id: string;
  studentId: string;
  routeId: string;
  type: 'indiscipline' | 'health' | 'other';
  severity: 'low' | 'medium' | 'high';
  monitorName: string;
  description: string;
  date: string; // YYYY-MM-DD HH:mm
};

export type SchoolYearPeriod = {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: string;
  read: boolean;
  link?: string;
};

type AppState = {
  currentUser: UserProfile | null;
  users: UserProfile[];
  login: (email: string, password?: string) => boolean;
  register: (email: string, name: string, password?: string, role?: 'admin' | 'manager' | 'monitor' | null) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  routes: Route[];
  students: Student[];
  attendance: AttendanceRecord[];
  incidents: Incident[];
  schoolYearPeriod: SchoolYearPeriod | null;
  updateSchoolYearPeriod: (period: SchoolYearPeriod) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, route: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  markAttendance: (studentId: string, date: string, type: 'boarding' | 'alighting', value: boolean) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'date'>) => void;
  deleteIncident: (id: string) => void;
};

const defaultState: AppState = {
  currentUser: null,
  users: [],
  login: () => false,
  register: () => ({ success: false }),
  logout: () => {},
  updateProfile: () => {},
  deleteUser: () => {},
  routes: [],
  students: [],
  attendance: [],
  incidents: [],
  schoolYearPeriod: null,
  updateSchoolYearPeriod: () => {},
  notifications: [],
  addNotification: () => {},
  markNotificationAsRead: () => {},
  clearNotifications: () => {},
  addRoute: () => {},
  updateRoute: () => {},
  deleteRoute: () => {},
  addStudent: () => {},
  updateStudent: () => {},
  deleteStudent: () => {},
  markAttendance: () => {},
  addIncident: () => {},
  deleteIncident: () => {},
};

const AppContext = createContext<AppState>(defaultState);

export const useAppContext = () => useContext(AppContext);

// Initial mock data
const initialRoutes: Route[] = [
  { id: 'r1', name: 'Rota Pelourinho', driver: 'João Silva', driverPhone: '(71) 99999-0001', monitorName: 'Carla Dias', monitorPhone: '(71) 98888-0002' },
  { id: 'r2', name: 'Rota Rio Vermelho', driver: 'Maria Santos', driverPhone: '(71) 97777-0003', monitorName: 'Pedro Alves', monitorPhone: '(71) 96666-0004' },
];

const initialStudents: Student[] = [
  {
    id: 's1',
    name: 'Dandara dos Santos',
    address: 'Rua das Laranjeiras, 12',
    class: '5º Ano A',
    school: 'Escola Municipal Zumbi dos Palmares',
    routeId: 'r1',
    contact1Name: 'Mãe (Ana)',
    contact1Phone: '(71) 99999-1111',
    contact2Name: 'Avó (Lúcia)',
    contact2Phone: '(71) 98888-2222',
  },
  {
    id: 's2',
    name: 'Zumbi Oliveira',
    address: 'Ladeira do Carmo, 45',
    class: '6º Ano B',
    school: 'Escola Municipal Zumbi dos Palmares',
    routeId: 'r1',
    contact1Name: 'Pai (Carlos)',
    contact1Phone: '(71) 97777-3333',
    contact2Name: 'Tio (Marcos)',
    contact2Phone: '(71) 96666-4444',
  },
  {
    id: 's3',
    name: 'Luiza Mahin',
    address: 'Av. Oceânica, 100',
    class: '4º Ano C',
    school: 'Escola Municipal Castro Alves',
    routeId: 'r2',
    contact1Name: 'Mãe (Teresa)',
    contact1Phone: '(71) 95555-5555',
    contact2Name: 'Irmão (Pedro)',
    contact2Phone: '(71) 94444-6666',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('school_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('school_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [routes, setRoutes] = useState<Route[]>(() => {
    const saved = localStorage.getItem('school_routes');
    return saved ? JSON.parse(saved) : initialRoutes;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('school_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('school_incidents');
    return saved ? JSON.parse(saved) : [];
  });

  const [schoolYearPeriod, setSchoolYearPeriod] = useState<SchoolYearPeriod | null>(() => {
    const saved = localStorage.getItem('school_year_period');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('school_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('school_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('school_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('school_year_period', JSON.stringify(schoolYearPeriod));
  }, [schoolYearPeriod]);

  useEffect(() => {
    localStorage.setItem('school_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('school_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('school_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('school_current_user');
    }
  }, [currentUser]);

  const login = (email: string, password?: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (email: string, name: string, password?: string, role: 'admin' | 'manager' | 'monitor' | null = null) => {
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Este email já está em uso.' };
    }

    if (role === 'monitor') {
      const isMonitorInRoutes = routes.some(r => r.monitorName.toLowerCase() === name.toLowerCase());
      if (!isMonitorInRoutes) {
        return { success: false, error: 'Monitor não cadastrado em nenhuma rota. Verifique o nome com a gestão.' };
      }
    }

    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      password,
      role,
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...profile };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addRoute = (route: Omit<Route, 'id'>) => {
    setRoutes([...routes, { ...route, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateRoute = (id: string, updatedRoute: Partial<Route>) => {
    setRoutes(routes.map(r => r.id === id ? { ...r, ...updatedRoute } : r));
  };

  const deleteRoute = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
    setStudents(students.map(s => s.routeId === id ? { ...s, routeId: '' } : s));
  };

  const addStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    setStudents([...students, newStudent]);
    addNotification({
      title: 'Novo Aluno Cadastrado',
      message: `${student.name} foi adicionado(a) à rota ${routes.find(r => r.id === student.routeId)?.name || 'Não informada'}.`,
      type: 'success',
      link: `/students?search=${newStudent.id}`
    });
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updatedStudent } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setAttendance(attendance.filter(a => a.studentId !== id));
    setIncidents(incidents.filter(i => i.studentId !== id));
  };

  const markAttendance = (studentId: string, date: string, type: 'boarding' | 'alighting', value: boolean) => {
    const dateObj = new Date(date + 'T12:00:00');
    if (isSunday(dateObj)) {
      alert("O check-in está fechado aos domingos. O sistema só contabiliza de segunda a sábado.");
      return;
    }

    setAttendance(prev => {
      const existingIndex = prev.findIndex(a => a.studentId === studentId && a.date === date);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        const record = { ...updated[existingIndex] };
        
        if (type === 'boarding') {
          record.boarding = value;
          record.boardingTime = value ? now : undefined;
        } else {
          record.alighting = value;
          record.alightingTime = value ? now : undefined;
        }
        
        updated[existingIndex] = record;
        return updated;
      } else {
        return [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          studentId,
          date,
          boarding: type === 'boarding' ? value : false,
          alighting: type === 'alighting' ? value : false,
          boardingTime: type === 'boarding' && value ? now : undefined,
          alightingTime: type === 'alighting' && value ? now : undefined,
        }];
      }
    });
  };

  const addIncident = (incident: Omit<Incident, 'id' | 'date'>) => {
    const now = new Date();
    const newIncident: Incident = {
      ...incident,
      id: Math.random().toString(36).substr(2, 9),
      date: format(now, 'yyyy-MM-dd HH:mm')
    };
    setIncidents([newIncident, ...incidents]);
    addNotification({
      title: 'Nova Ocorrência Registrada',
      message: `Uma ocorrência de ${incident.type === 'indiscipline' ? 'indisciplina' : incident.type === 'health' ? 'saúde' : 'outros'} foi registrada para o aluno ${students.find(s => s.id === incident.studentId)?.name}.`,
      type: incident.severity === 'high' ? 'error' : 'warning',
      link: '/incidents'
    });
  };

  const deleteIncident = (id: string) => {
    setIncidents(incidents.filter(i => i.id !== id));
  };

  const updateSchoolYearPeriod = (period: SchoolYearPeriod) => {
    setSchoolYearPeriod(period);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, login, register, logout, updateProfile, deleteUser,
      routes, students, attendance, incidents,
      schoolYearPeriod, updateSchoolYearPeriod,
      notifications, addNotification, markNotificationAsRead, clearNotifications,
      addRoute, updateRoute, deleteRoute,
      addStudent, updateStudent, deleteStudent,
      markAttendance, addIncident, deleteIncident
    }}>
      {children}
    </AppContext.Provider>
  );
};
