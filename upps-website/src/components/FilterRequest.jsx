import React from 'react';

export const FilterRequest = ({ title, selectVal, options, handleSelectChange }) => {
  return (
    <div className="select-container">
      <p className="mb-3">{title}</p>
      <select
        value={selectVal}
        onChange={(e) => handleSelectChange(e.target.value)}
        className="px-[2rem] py-[1rem] rounded-[5px]"
        style={{ boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)" }}
      >
        <option value="">Select {title}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
