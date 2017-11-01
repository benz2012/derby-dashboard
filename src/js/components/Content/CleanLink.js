import { Link } from 'react-router-dom'
import styled from 'styled-components'

const CleanLink = styled(Link)`
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;

  &:hover, &:active, &:visited {
    color: ${props => props.theme.headerFG};
    text-decoration: none;
  }
`

export default CleanLink
