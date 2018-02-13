import styled from 'styled-components'

const StickyFooter = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: flex-end;

  padding: 5px;
  color: ${props => props.theme.contentBG};
  background-color: rgba(123, 65, 217, 0.75);
`

export default StickyFooter
