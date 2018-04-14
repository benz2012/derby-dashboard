import React from 'react'

const InputContainer = ({ id, label, help, children }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    {children}
    {
      help &&
      <small className="form-text text-muted">{help}</small>
    }
  </div>
)

export default InputContainer