import React from 'react'

import InputContainer from './InputContainer'

const TextInput = ({ id, label, value, onChange, ...rest }) => (
  <InputContainer id={id} label={label} help={rest.help}>
    <input
      key={`${id}-input`}
      type="text"
      className="form-control"
      id={id}
      value={value}
      onChange={onChange}
      {...rest}
    />
  </InputContainer>
)

export default TextInput
