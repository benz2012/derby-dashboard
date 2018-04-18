import React from 'react'


const CheckboxInput = ({ id, label, value, onChange, ...rest }) => (
  <div className="form-group">
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={value}
        onChange={onChange}
        {...rest}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
    {
      rest.help &&
      <small className="form-text text-muted">{rest.help}</small>
    }
  </div>

)

export default CheckboxInput
