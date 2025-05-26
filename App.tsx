
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StaffMember, Leave } from './types';
import { AVAILABLE_COLORS }
from './constants';
import StaffManager from './components/StaffManager';
import CalendarGrid from './components/CalendarGrid';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [staffMembers, setStaffMembers] = useLocalStorage<StaffMember[]>('annualLeavePlanner_staff', []);
  const [leaves, setLeaves] = useLocalStorage<Leave[]>('annualLeavePlanner_leaves', []);
  const [activeStaffId, setActiveStaffId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [selectionAnchorDate, setSelectionAnchorDate] = useState<Date | null>(null);
  const [highlightedRange, setHighlightedRange] = useState<string[]>([]);

  // Check session storage for authentication status on mount
  useEffect(() => {
    if (sessionStorage.getItem('annualLeavePlanner_isAuthenticated_ratolladmin') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded password as per request
    if (passwordInput === 'ratolladmin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('annualLeavePlanner_isAuthenticated_ratolladmin', 'true');
      setAuthError('');
      setPasswordInput(''); // Clear password input on success
    } else {
      setAuthError('Incorrect password. Please try again.');
      setPasswordInput('');
    }
  };

  const addStaff = useCallback((name: string) => {
    const newStaffMember: StaffMember = {
      id: Date.now().toString(),
      name,
      color: AVAILABLE_COLORS[staffMembers.length % AVAILABLE_COLORS.length],
    };
    setStaffMembers(prev => [...prev, newStaffMember]);
  }, [staffMembers.length, setStaffMembers]);
  
  const removeStaff = useCallback((staffIdToRemove: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== staffIdToRemove));
    setLeaves(prev => prev.filter(leave => leave.staffId !== staffIdToRemove));
    if (activeStaffId === staffIdToRemove) {
      setActiveStaffId(null);
    }
  }, [setStaffMembers, setLeaves, activeStaffId]);

  const getDatesInRange = (startDate: Date, endDate: Date): string[] => {
    const dates: string[] = [];
    const start = new Date(Math.min(startDate.getTime(), endDate.getTime()));
    const end = new Date(Math.max(startDate.getTime(), endDate.getTime()));
    
    let currentDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const lastDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    while (currentDate <= lastDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        currentDate = nextDate;
    }
    return dates;
  };

  const handleDateMouseDown = useCallback((date: Date) => {
    setIsMouseDown(true);
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectionAnchorDate(normalizedDate);
    setHighlightedRange([normalizedDate.toISOString().split('T')[0]]);
  }, []);

  const handleDateMouseEnter = useCallback((date: Date) => {
    if (isMouseDown && selectionAnchorDate) {
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      setHighlightedRange(getDatesInRange(selectionAnchorDate, normalizedDate));
    }
  }, [isMouseDown, selectionAnchorDate]);

  const handleGlobalMouseUp = useCallback(() => {
    if (!isMouseDown) return;
    setIsMouseDown(false); 

    if (!activeStaffId) {
      if (highlightedRange.length > 0) { 
          alert("Please select a staff member first to assign or unassign leave.");
      }
      setSelectionAnchorDate(null);
      setHighlightedRange([]);
      return;
    }

    if (highlightedRange.length > 0) {
      setLeaves(prevLeaves => {
        let newLeavesList = [...prevLeaves];
        highlightedRange.forEach(dateString => {
          const existingLeaveIndex = newLeavesList.findIndex(
            leave => leave.staffId === activeStaffId && leave.date === dateString
          );
          if (existingLeaveIndex > -1) {
            newLeavesList = newLeavesList.filter((_, index) => index !== existingLeaveIndex);
          } else {
            newLeavesList.push({ staffId: activeStaffId, date: dateString });
          }
        });
        return newLeavesList;
      });
    }
    setSelectionAnchorDate(null);
    setHighlightedRange([]);
  }, [isMouseDown, activeStaffId, highlightedRange, setLeaves]);

  const handleGlobalMouseUpRef = useRef(handleGlobalMouseUp);
  useEffect(() => {
    handleGlobalMouseUpRef.current = handleGlobalMouseUp;
  }, [handleGlobalMouseUp]);

  useEffect(() => {
    const upHandler = () => {
        handleGlobalMouseUpRef.current();
    };
    window.addEventListener('mouseup', upHandler);
    return () => {
      window.removeEventListener('mouseup', upHandler);
    };
  }, []); 

  const handleChangeYear = useCallback((increment: number) => {
    setSelectedYear(prevYear => prevYear + increment);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-700 p-4">
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-slate-700 mb-3">Access Planner</h1>
          <p className="text-slate-500 mb-8">Please enter the password to continue.</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-lg"
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">{authError}</p>
            )}
            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg"
              >
                Access Planner
              </button>
            </div>
          </form>
           <p className="mt-8 text-xs text-slate-400">
            This is a client-side password prompt for basic access control.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 text-slate-800">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400 pb-2">
          Annual Leave Planner
        </h1>
        <p className="text-slate-600 text-lg">Manage your team's time off with ease.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 xl:col-span-3">
          <StaffManager
            staffMembers={staffMembers}
            activeStaffId={activeStaffId}
            onAddStaff={addStaff}
            onSetActiveStaff={setActiveStaffId}
            onRemoveStaff={removeStaff}
          />
        </aside>
        
        <main className="lg:col-span-8 xl:col-span-9">
          <CalendarGrid
            year={selectedYear}
            leaves={leaves}
            staffMembers={staffMembers}
            onChangeYear={handleChangeYear}
            onDateMouseDown={handleDateMouseDown}
            onDateMouseEnter={handleDateMouseEnter}
            highlightedRange={highlightedRange}
          />
        </main>
      </div>
      
      <footer className="mt-12 pt-8 border-t border-slate-300 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Annual Leave Planner. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
