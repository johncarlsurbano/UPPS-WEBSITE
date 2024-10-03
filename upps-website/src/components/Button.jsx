import React from 'react'

const Button = ({style,title,onClick,type}) => {
  return (
    <button type={type} className={style} onClick={onClick}>{title}</button>
  )
}

export default Button