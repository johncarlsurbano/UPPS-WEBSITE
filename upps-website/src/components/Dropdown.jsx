import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Dropdown = ({ name, items, value, handleChange, valueKey = 'id', displayKey = 'name', label }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        name={name}
        value={value || ""}
        onChange={handleChange}
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
