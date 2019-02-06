import React from 'react'
import styled from 'styled-components'

import theme from '../../styles/theme'
import IconButton from './IconButton'
import PlainButton from './PlainButton'

const buttonColor = selected => (selected ? theme.textAccent : theme.textDampen)

const SaveSelection = ({ selected, onClick, ...rest }) => (
  <Container>
    <IconButton onClick={onClick} color={buttonColor(selected)} fontSize={36} {...rest}>
      {selected ? 'check_circle' : 'radio_button_unchecked'}
    </IconButton>
    <TagLine onClick={onClick} color={buttonColor(selected)}>
      Save my selection
    </TagLine>
  </Container>
)

const Container = styled.div`
  display: flex;
  align-items: center;
`

const TagLine = styled(PlainButton)`
  color: ${props => props.color};
  font-size: 24px;
  padding-left: 15px;
`

export default SaveSelection
