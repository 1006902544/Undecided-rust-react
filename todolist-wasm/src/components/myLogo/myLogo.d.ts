import type {DetailedHTMLProps,ButtonHTMLAttributes,HTMLButtonElement} from 'react'

export interface MyLogoProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
  width?:number,
  keycode:string
}