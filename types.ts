
export interface StaffMember {
  id: string;
  name: string;
  color: string; // Tailwind CSS background color class, e.g., 'bg-blue-500'
}

export interface Leave {
  staffId: string;
  date: string; // Format: 'YYYY-MM-DD'
}
