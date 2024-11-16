import React from 'react';

const DashboardCounterBox = ({ title, count, backgroundColor, textColor, countColor }) => {
  return (
    <div
      className={`h-full p-3 rounded-md flex flex-col ${backgroundColor} ${textColor}`}
      style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}
    >
      <p className="font-medium"> {title} </p>
      <h1 className={`self-center ${countColor}`}>{count}</h1>
    </div>
  );
};

export default DashboardCounterBox;