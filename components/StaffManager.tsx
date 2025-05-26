
import React, { useState } from 'react';
import { StaffMember } from '../types';

interface StaffManagerProps {
  staffMembers: StaffMember[];
  activeStaffId: string | null;
  onAddStaff: (name: string) => void;
  onSetActiveStaff: (staffId: string | null) => void;
  onRemoveStaff: (staffId: string) => void;
}

const StaffManager: React.FC<StaffManagerProps> = ({ staffMembers, activeStaffId, onAddStaff, onSetActiveStaff, onRemoveStaff }) => {
  const [newStaffName, setNewStaffName] = useState('');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStaffName.trim()) {
      onAddStaff(newStaffName.trim());
      setNewStaffName('');
    }
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg border border-slate-200">
      <h2 className="text-2xl font-semibold mb-6 text-slate-700">Staff Members</h2>
      
      <form onSubmit={handleAddStaff} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newStaffName}
          onChange={(e) => setNewStaffName(e.target.value)}
          placeholder="Enter staff name"
          className="flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Staff
        </button>
      </form>

      {staffMembers.length === 0 ? (
         <p className="text-slate-500 italic">No staff members added yet. Add one to start planning!</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              onClick={() => onSetActiveStaff(staff.id === activeStaffId ? null : staff.id)}
              className={`flex items-center justify-between p-4 rounded-md cursor-pointer transition-all duration-150 ease-in-out border
                          ${activeStaffId === staff.id ? 'bg-blue-100 border-blue-500 shadow-md scale-105' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full ${staff.color} ring-1 ring-offset-1 ring-slate-400`}></span>
                <span className={`font-medium ${activeStaffId === staff.id ? 'text-blue-700' : 'text-slate-700'}`}>{staff.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering setActiveStaff
                  if (window.confirm(`Are you sure you want to remove ${staff.name}? This will also remove all their planned leave.`)) {
                    onRemoveStaff(staff.id);
                  }
                }}
                className="text-red-500 hover:text-red-700 transition-colors text-xs p-1 rounded hover:bg-red-100"
                title={`Remove ${staff.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
       {activeStaffId && staffMembers.find(s => s.id === activeStaffId) && (
        <p className="mt-4 text-sm text-blue-600 bg-blue-50 p-3 rounded-md border border-blue-200">
          🗓️ Click on dates in the calendar to mark leave for <span className="font-semibold">{staffMembers.find(s => s.id === activeStaffId)?.name}</span>. Click again to unmark.
        </p>
      )}
       {!activeStaffId && staffMembers.length > 0 && (
        <p className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200">
          👆 Select a staff member above to start planning their leave.
        </p>
      )}
    </div>
  );
};

export default StaffManager;
