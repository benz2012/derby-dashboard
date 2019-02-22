import React from 'react'

import TextInput from './TextInput'
import TextAreaInput from './TextAreaInput'
import SelectInput from './SelectInput'
import CheckboxInput from './CheckboxInput'
import DateInput from './DateInput'
import TimeInput from './TimeInput'

const FormContainer = ({ children }) => (
  <form>
    {children}
  </form>
)

export default FormContainer
export {
  TextInput,
  TextAreaInput,
  SelectInput,
  CheckboxInput,
  DateInput,
  TimeInput,
}
