
import React from 'react';
import { Leave, StaffMember } from '../types';
import MonthView from './MonthView';

interface CalendarGridProps {
  year: number;
  leaves: Leave[];
  staffMembers: StaffMember[];
  onChangeYear: (increment: number) => void;
  // Props for multi-date selection
  onDateMouseDown: (date: Date) => void;
  onDateMouseEnter: (date: Date) => void;
  highlightedRange: string[]; // Array of 'YYYY-MM-DD' strings
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  leaves,
  staffMembers,
  onChangeYear,
  onDateMouseDown,
  onDateMouseEnter,
  highlightedRange,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg border border-slate-200">
        <button
          onClick={() => onChangeYear(-1)}
          className="px-5 py-2.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Prev Year
        </button>
        <h2 className="text-3xl font-bold text-slate-700">{year}</h2>
        <button
          onClick={() => onChangeYear(1)}
          className="px-5 py-2.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 flex items-center"
        >
          Next Year
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
        {Array.from({ length: 12 }).map((_, index) => (
          <MonthView
            key={index}
            year={year}
            month={index} // 0-11
            leaves={leaves}
            staffMembers={staffMembers}
            onDateMouseDown={onDateMouseDown}
            onDateMouseEnter={onDateMouseEnter}
            highlightedRange={highlightedRange}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
