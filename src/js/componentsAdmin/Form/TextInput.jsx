import React from 'react'

const TextInput = ({ id, label, value, onChange, ...rest }) => (
  <div className="form-group">
    <label key={`${id}-label`} htmlFor={id}>{label}</label>
    <input
      key={`${id}-input`}
      type="text"
      className="form-control"
      id={id}
      value={value}
      onChange={onChange}
      {...rest}
    />
  </div>
)

export default TextInput
