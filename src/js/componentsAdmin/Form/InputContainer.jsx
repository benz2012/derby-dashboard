import React from 'react'

const InputContainer = ({ id, label, help, error, prepend, children }) => (
  <div className={label ? 'form-group' : ''}>
    {
      label &&
      <label htmlFor={id}>{label}</label>
    }
    {
      prepend ? (
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">{prepend}</span>
          </div>
          {children}
          {
            error &&
            <div className="invalid-feedback">{error}</div>
          }
        </div>
      ) : (
        <React.Fragment>
          {children}
          {
            error &&
            <div className="invalid-feedback">{error}</div>
          }
        </React.Fragment>
      )
    }
    {
      help &&
      <small className="form-text text-muted">{help}</small>
    }
  </div>
)

export default InputContainer
