import React from 'react'

const InputFields = ({name,type,placeholder,style}) => {
  return (
    <>
    <input type={type} name={name} placeholder={placeholder}  className={`border-solid border border-black w-full h-[60px] rounded-md mb-4 placeholder: pl-4 ${style}`} />
    </>
  )
}

export default InputFields;
