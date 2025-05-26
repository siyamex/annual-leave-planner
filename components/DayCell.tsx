
import React from 'react';

interface LeaveIndicator {
  staffId: string;
  color: string;
  staffName: string; 
}

interface DayCellProps {
  day: number | null;
  fullDate: Date | null; 
  isToday: boolean;
  isCurrentMonth: boolean;
  leavesOnThisDate: LeaveIndicator[];
  isHighlighted: boolean; 
  onCellMouseDown?: (date: Date) => void; 
  onCellMouseEnter?: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  fullDate,
  isToday,
  isCurrentMonth,
  leavesOnThisDate,
  isHighlighted,
  onCellMouseDown,
  onCellMouseEnter,
}) => {
  if (!day || !fullDate) {
    return <div className="border border-slate-200 aspect-square bg-slate-50"></div>;
  }

  let cellBaseBgColor = isCurrentMonth ? "bg-white" : "bg-slate-50";
  let cellHoverBgColor = isCurrentMonth ? "hover:bg-blue-50" : "hover:bg-slate-100";
  let ringStyle = "";

  if (isHighlighted) {
    cellBaseBgColor = "bg-sky-100"; // Highlighted background
    cellHoverBgColor = "hover:bg-sky-200"; // Slightly darker hover for highlighted
    ringStyle = "ring-2 ring-sky-400 ring-inset z-10"; // Prominent ring for selection
  }
  
  const cellClasses = [
    "border border-slate-200 aspect-square p-1.5 flex flex-col items-center justify-start transition-colors duration-100 ease-in-out relative",
    cellBaseBgColor,
    (onCellMouseDown || onCellMouseEnter) ? "cursor-pointer" : "cursor-default",
    cellHoverBgColor,
    ringStyle,
  ].filter(Boolean).join(" ");

  const dayNumberClasses = [
    "text-xs sm:text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center",
    isToday ? "bg-blue-600 text-white" : (isCurrentMonth ? "text-slate-700" : "text-slate-400"),
    isHighlighted && !isToday ? (isCurrentMonth ? "text-sky-700" : "text-sky-500") : "",
    isHighlighted && isToday ? "ring-1 ring-offset-1 ring-offset-sky-100 ring-white" : "" // Special ring for today if also highlighted
  ].filter(Boolean).join(" ");


  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent text selection/drag behavior when initiating click on day cell
    e.preventDefault(); 
    if (fullDate && onCellMouseDown) {
      onCellMouseDown(fullDate);
    }
  };

  const handleMouseEnter = () => {
    if (fullDate && onCellMouseEnter) {
      onCellMouseEnter(fullDate);
    }
  };

  return (
    <div
      className={cellClasses}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      // Prevent default drag behavior more broadly
      onDragStart={(e) => e.preventDefault()} 
    >
      <span className={dayNumberClasses}>{day}</span>
      {leavesOnThisDate.length > 0 && (
        <div className="absolute bottom-1 left-1 right-1 flex justify-center items-end space-x-0.5 sm:space-x-1 p-0.5 flex-wrap">
          {leavesOnThisDate.slice(0, 3).map((leave, index) => ( // Max 3 indicators
            <div
              key={`${leave.staffId}-${index}`}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${leave.color} ring-1 ring-offset-[0.5px] ring-white/70`}
              title={leave.staffName}
            ></div>
          ))}
          {leavesOnThisDate.length > 3 && (
            <span className="text-[9px] sm:text-[10px] text-slate-500 ml-0.5 font-medium">+{leavesOnThisDate.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DayCell;
