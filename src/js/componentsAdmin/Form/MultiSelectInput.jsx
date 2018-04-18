import React from 'react'
import Select from 'react-select'

import InputContainer from './InputContainer'

const MultiSelectInput = ({ id, label, options, value, onChange, ...rest }) => (
  <InputContainer id={id} label={label} help={rest.help}>
    <Select
      closeOnSelect={false}
      removeSelected
      multi
      onChange={this.onChange}
      options={options}
      placeholder="Select linked challenge(s)"
      simpleValue
      value={value}
      {...rest}
    />
  </InputContainer>
)

export default MultiSelectInput
