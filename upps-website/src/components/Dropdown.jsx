import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Dropdown = ({ name, items, value, handleChange, valueKey = 'id', displayKey = 'name', label, defaultValue }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        name={name}
        value={value || ""}
        onChange={handleChange}
        defaultValue={defaultValue}
      >
        {items.map((item, index) => (
          <MenuItem key={index} value={item[valueKey]}>
            {item[displayKey]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
