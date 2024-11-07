import React from 'react'
import { motion } from 'framer-motion'

const MotionButton = ({buttonText, className, onClick, disabled}) => {
  return (
    <motion.button
    initial={{ scale: '1' }}
    whileTap={{ scale: '0.95' }}
    className={className}
    onClick={onClick}
    disabled={disabled}
    >{buttonText}</motion.button>
  )
}

export default MotionButton