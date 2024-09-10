import React from 'react'
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Dropdown = ({value,handleChange,items}) => {
    return (
        <div>
            <FormControl fullWidth>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    onChange={handleChange}
                    className='border-black border w-full h-[60px]'
                >
                    {items.map((item) => <MenuItem value={item}>{item}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
    )
}

export default Dropdown