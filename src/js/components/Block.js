import styled from 'styled-components'

const Block = styled.div`
  width: 100%;
  height: auto;
  box-sizing: border-box;
  overflow: hidden;

  margin-bottom: 10px;
  padding: 10px 10px;

  background-color: ${props => props.theme.contentBG};
  color: ${props => props.theme.contentFG};
`

export default Block
