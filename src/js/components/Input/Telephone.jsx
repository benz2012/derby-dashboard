import React from 'react'

import { Container, InputContainer, Input, FocusBorder } from './style'

const Telephone = ({ value, onChange }) => (
  <Container>
    <InputContainer>

      <Input
        id="telNumber"
        type="tel"
        placeholder="111-111-1111"
        required
        value={value}
        onChange={onChange}
      />
      <FocusBorder />

    </InputContainer>
  </Container>
)

export default Telephone
