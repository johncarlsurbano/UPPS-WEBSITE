import React from 'react'

const Button = ({style,title,onClick}) => {
  return (
    <button type="button" className={style} onClick={onClick} >{title}</button>
  )
}

export default Button