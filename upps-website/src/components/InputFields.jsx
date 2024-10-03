import React from 'react'

const InputFields = ({name,type,placeholder,style,onChange,value}) => {
  return (
    <>
    <input type={type} name={name} placeholder={placeholder} value={value} className={`border-solid border border-black  h-[60px] rounded-md mb-2 placeholder: pl-4 ${style}`} onChange={onChange}/>
    </>
  )
}

export default InputFields;
