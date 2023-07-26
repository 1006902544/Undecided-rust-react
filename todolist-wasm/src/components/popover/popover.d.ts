import type { CSSProperties } from "react"

export type PopoverType = 'click'|'hover'

export interface PopoverProps {
  children?:React.ReactNode,
  content?:React.ReactNode,
  type?:PopoverType,
  className?:string,
  style?:CSSProperties,
}

export interface PopoverAlign {
  width:number,
  left:number
  top:number
}