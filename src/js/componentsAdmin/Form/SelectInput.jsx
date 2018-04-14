import React from 'react'

import InputContainer from './InputContainer'

const SelectInput = ({ id, label, options, value, onChange, ...rest }) => (
  <InputContainer id={id} label={label} help={rest.help}>
    <select className="form-control" id={id} value={value} onChange={onChange} {...rest}>
      {
        options.map(opt => (
          <option key={`${opt}-select`} value={opt}>{opt}</option>
        ))
      }
    </select>
  </InputContainer>
)

export default SelectInput
