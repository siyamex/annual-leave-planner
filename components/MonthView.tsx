
import React from 'react';
import { Leave, StaffMember } from '../types';
import { DAYS_OF_WEEK_SHORT, MONTH_NAMES } from '../constants';
import DayCell from './DayCell';

interface MonthViewProps {
  year: number;
  month: number; // 0-11
  leaves: Leave[];
  staffMembers: StaffMember[];
  // Props for multi-date selection
  onDateMouseDown: (date: Date) => void;
  onDateMouseEnter: (date: Date) => void;
  highlightedRange: string[]; // Array of 'YYYY-MM-DD' strings
}

const MonthView: React.FC<MonthViewProps> = ({
  year,
  month,
  leaves,
  staffMembers,
  onDateMouseDown,
  onDateMouseEnter,
  highlightedRange,
}) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const staffMap = new Map(staffMembers.map(s => [s.id, s]));

  const renderCells = () => {
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(
        <DayCell
          key={`empty-start-${i}`}
          day={null}
          fullDate={null}
          isToday={false}
          isCurrentMonth={false}
          leavesOnThisDate={[]}
          isHighlighted={false}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      // Use normalized date for consistent string formatting and comparison
      const currentDate = new Date(year, month, day); 
      // currentDate.setHours(0,0,0,0); // Normalization happens here before generating dateString
      const dateString = currentDate.toISOString().split('T')[0];
      
      const leavesOnThisDate = leaves
        .filter(leave => leave.date === dateString)
        .map(leave => {
            const staff = staffMap.get(leave.staffId);
            return staff ? { staffId: staff.id, color: staff.color, staffName: staff.name } : null;
        })
        .filter(Boolean) as Array<{ staffId: string, color: string, staffName: string }>;

      cells.push(
        <DayCell
          key={day}
          day={day}
          fullDate={currentDate} // Pass the non-normalized date for event handlers, normalization will happen in App.tsx
          isToday={currentDate.setHours(0,0,0,0) === today.getTime()} // Normalize for 'isToday' check
          isCurrentMonth={true}
          leavesOnThisDate={leavesOnThisDate}
          isHighlighted={highlightedRange.includes(dateString)}
          onCellMouseDown={onDateMouseDown}
          onCellMouseEnter={onDateMouseEnter}
        />
      );
    }
    
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDayOfMonth + daysInMonth);

    for (let i = 0; i < remainingCells; i++) {
      cells.push(
        <DayCell
          key={`empty-end-${i}`}
          day={null}
          fullDate={null}
          isToday={false}
          isCurrentMonth={false}
          leavesOnThisDate={[]}
          isHighlighted={false}
        />
      );
    }

    return cells;
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg border border-slate-200 select-none">
      <h3 className="text-xl font-semibold text-center mb-3 text-slate-700">{MONTH_NAMES[month]} {year}</h3>
      <div className="grid grid-cols-7 gap-px">
        {DAYS_OF_WEEK_SHORT.map(dayName => (
          <div key={dayName} className="text-center font-medium text-xs text-slate-500 py-2 border-b border-slate-200">
            {dayName}
          </div>
        ))}
        {renderCells()}
      </div>
    </div>
  );
};

export default MonthView;
