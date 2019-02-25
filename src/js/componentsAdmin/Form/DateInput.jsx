import React from 'react'
import Flatpickr from 'react-flatpickr'
import styled from 'styled-components'
import 'flatpickr/dist/themes/material_blue.css'

import InputContainer from './InputContainer'

const WhiteFlatpicker = styled(Flatpickr)`
  &&& {
    background-color: inherit;
  }
`

const DateInput = ({ id, label, value, error, onChange, options, ...rest }) => (
  <InputContainer id={id} label={label} help={rest.help} error={error}>
    <WhiteFlatpicker
      id={id}
      className="form-control flatpicker-input"
      value={value}
      onChange={(selectedDates, dateStr) => onChange({
        target: { id, value: dateStr, selectedDates },
      })}
      options={{
        altInput: true,
        allowInput: true,
        altInputClass: id,
        ...options,
      }}
      {...rest}
    />
  </InputContainer>
)

export default DateInput
