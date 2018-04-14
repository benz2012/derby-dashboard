import React from 'react'

import TextInput from './TextInput'
import TextAreaInput from './TextAreaInput'

const FormContainer = ({ children }) => (
  <form>
    {children}
  </form>
)

export default FormContainer
export {
  TextInput,
  TextAreaInput,
}
