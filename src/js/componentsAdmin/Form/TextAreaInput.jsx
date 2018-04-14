import React from 'react'

const TextAreaInput = ({ id, label, value, onChange, ...rest }) => (
  <div className="form-group">
    <label key={`${id}-label`} htmlFor={id}>{label}</label>
    <textarea
      key={`${id}-input`}
      className="form-control"
      id={id}
      value={value}
      onChange={onChange}
      {...rest}
    />
  </div>
)

export default TextAreaInput
