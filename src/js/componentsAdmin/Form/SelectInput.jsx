import React from 'react'

import InputContainer from './InputContainer'

const SelectInput = ({ id, label, options, ids, value, onChange, ...rest }) => (
  <InputContainer id={id} label={label} help={rest.help}>
    <select className="form-control" id={id} value={value} onChange={onChange} {...rest}>
      {
        options.map((opt, idx) => (
          <option key={`${opt}-select`} id={ids && ids[idx]} value={opt}>{opt}</option>
        ))
      }
    </select>
  </InputContainer>
)

export default SelectInput
