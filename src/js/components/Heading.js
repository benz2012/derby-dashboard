import styled from 'styled-components'

const Heading = styled.h1`
  margin: 0px;
  margin-top: 5px;
  margin-bottom: 10px;

  font-family: ${props => props.theme.fontHeading};
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 1px;
`

export default Heading
