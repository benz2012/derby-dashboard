import React from 'react'
import styled, { css } from 'styled-components'

import { FontIcon } from './Content'

// Styles
const Message = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0px;

  border: 1px solid;

  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;

  ${props => props.success && css`
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  `}
`

const Text = styled.div`
  padding-left: 10px;
`

// Main Function
const Status = ({ show, success, message }) => (
  show &&
  <Message success={success}>
    <FontIcon className="material-icons" color="inherit">
      {success ? 'check_circle' : 'error'}
    </FontIcon>
    <Text>{message}</Text>
  </Message>
)

export default Status
