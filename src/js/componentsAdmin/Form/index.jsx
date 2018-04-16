import React from 'react'

import TextInput from './TextInput'
import TextAreaInput from './TextAreaInput'
import SelectInput from './SelectInput'
import CheckboxInput from './CheckboxInput'

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
}
