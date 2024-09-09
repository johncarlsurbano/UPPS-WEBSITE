import React from 'react'

const Button = ({style,title}) => {
  return (
    <button type="button" className={style} >{title}</button>
  )
}

export default Button