import React from 'react'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import styled from 'styled-components'
import 'flatpickr/dist/themes/material_blue.css'

import InputContainer from './InputContainer'

const WhiteFlatpicker = styled(Flatpickr)`
  &&& {
    background-color: inherit;
  }
`

const TimeInput = ({ id, label, value, error, onChange, ...rest }) => (
  <InputContainer id={id} label={label} help={rest.help} error={error}>
    <WhiteFlatpicker
      id={id}
      className="form-control flatpicker-input"
      value={value}
      onClick={() => {
        const fpd = document.getElementById(id)._flatpickr.selectedDates[0]
        onChange({ target: { id, value: moment(fpd).format('HH:mm') } })
      }}
      onChange={(selectedDates, dateStr) => onChange({
        target: { id, value: dateStr },
      })}
      options={{
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        allowInput: true,
      }}
      {...rest}
    />
  </InputContainer>
)

export default TimeInput
