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

const TimeInput = ({ id, label, value, onChange, ...rest }) => (
  <InputContainer id={id} label={label} help={rest.help}>
    <WhiteFlatpicker
      id={id}
      className="form-control flatpicker-input"
      value={value}
      onChange={(selectedDates, dateStr) => onChange({
        target: { id, value: dateStr },
      })}
      options={{
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
      }}
    />
  </InputContainer>
)

export default TimeInput
