import styled from 'styled-components'

const Card = styled.div`
  width: 90%;
  margin: auto;
  margin-bottom: 20px;
  background-color: ${props => props.theme.contentBG};
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  position: relative;
`

export default Card
