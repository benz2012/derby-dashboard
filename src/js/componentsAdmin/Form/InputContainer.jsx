import React from 'react'

const InputContainer = ({ id, label, help, error, children }) => (
  <div className={label ? 'form-group' : ''}>
    {
      label &&
      <label htmlFor={id}>{label}</label>
    }
    {children}
    {
      error &&
      <div className="invalid-feedback">{error}</div>
    }
    {
      help &&
      <small className="form-text text-muted">{help}</small>
    }
  </div>
)

export default InputContainer
