import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>


export function Button(props: ButtonProps) {


  const style = {
    backgroundColor: 'color-background-secondary',
    color: 'color-foreground',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: "100%",
  };
  
  return (
    <button style={style} {...props}></button>
  )
}