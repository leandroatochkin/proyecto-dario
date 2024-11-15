import React from 'react'

const DoubleArrow = ({width, height, className}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width || "96"} height={height || "96"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "lucide lucide-chevrons-right"}><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
  )
}

export default DoubleArrow