import styled from 'styled-components'

const HeadingText = styled.h1`
  margin: 0px;
  margin-top: 5px;
  margin-bottom: 10px;

  font-family: ${props => props.theme.fontHeading};
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 1px;
`

const HeadingText2 = styled.h2`
  margin: 0px;
  margin-top: 3px;
  margin-bottom: 8px;

  font-family: ${props => props.theme.fontHeading};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
`

const Prefix = styled.small`
  font-style: italic;
  color: ${props => props.theme.textDampen};
`

export default HeadingText
export {
  HeadingText2,
  Prefix,
}
