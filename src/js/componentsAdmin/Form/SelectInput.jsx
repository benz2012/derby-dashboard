import React from 'react'

import InputContainer from './InputContainer'

const SelectInput = ({ id, label, options, ids, value, error, onChange, ...rest }) => (
  <InputContainer id={id} label={label} help={rest.help} error={error}>
    <select className="form-control" id={id} value={value} onChange={onChange}>
      {
        options.map((opt, idx) => (
          <option
            key={`${opt}-select`}
            id={ids && ids[idx]}
            value={opt}
            {...rest}
          >
            {opt}
          </option>
        ))
      }
    </select>
  </InputContainer>
)

export default SelectInput
