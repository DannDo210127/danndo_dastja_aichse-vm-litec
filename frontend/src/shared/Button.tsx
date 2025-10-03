import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>


export function Button(props: ButtonProps) {


  const style = {
    backgroundColor: 'bg-primary',
    color: 'color-foreground',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    ...props.style
  };
  
  return (
    <button style={style} {...props}></button>
  )
}