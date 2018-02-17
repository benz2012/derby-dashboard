import styled from 'styled-components'

const Card = styled.div`
  width: 90%;
  margin: auto;
  margin-bottom: 20px;
  background-color: ${props => props.theme.contentBG};
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  position: relative;
`

const HalfCardGutter = 8
const CardFlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: calc(100% - ${2 * HalfCardGutter}px);
  padding: 0 ${HalfCardGutter}px;
`
const HalfCard = styled(Card)`
  width: calc(50% - ${2 * HalfCardGutter}px);
  margin: ${HalfCardGutter}px;

  box-shadow: ${props => (
    props.selected && '0px 0px 10px 3px rgba(232, 30, 99, 0.5)'
  )};
`

export {
  Card,
  CardFlexContainer,
  HalfCard,
}
