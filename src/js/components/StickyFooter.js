import styled from 'styled-components'

const StickyFooter = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;

  padding: 5px;
  color: ${props => props.theme.contentBG};
  background-color: ${props => props.theme['Team Activity']};
`

export default StickyFooter
