import React from 'react'

import './Button.scss'

interface ButtonProps {
  text: string
  onClick: (params: any) => any
  buttonStyle?: object
}

export default ({
  text,
  onClick,
  buttonStyle,
}: ButtonProps) => {
  return (
    <div
      className="button-container"
      onClick={onClick}
      style={buttonStyle}
    >
      <span className="button-text">
        {text}
      </span>
    </div>
  )
}