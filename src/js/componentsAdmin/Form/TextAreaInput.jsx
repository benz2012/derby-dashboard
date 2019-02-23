import React from 'react'

import InputContainer from './InputContainer'

const TextAreaInput = ({ id, label, value, error, onChange, ...rest }) => (
  <InputContainer id={id} label={label} help={rest.help} error={error}>
    <textarea
      className="form-control"
      id={id}
      value={value}
      onChange={onChange}
      {...rest}
    />
  </InputContainer>
)

export default TextAreaInput
