const Button = ({title, style, onClick, type }) =>{
    return(
        <>
            <button href="" type={type} className={style} onClick={onClick}>{title}</button>
        </>
    )
}

export default Button;