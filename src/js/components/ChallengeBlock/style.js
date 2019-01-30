import styled from 'styled-components'

const Container = styled.div`
  margin: 8px 0 0px 0px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-around;
`

const RowApart = styled(Row)`
  justify-content: space-between;
  align-items: center;
`

const Feature = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`

const Value = styled.div`
  font-size: 26px;
  font-weight: 300;
  text-align: center;
`

const Label = styled.div`
  padding-left: 4px;
  font-size: 14px;
  font-weight: 300;
  color: ${props => props.theme.textDampen};
`

export {
  Container,
  Row,
  RowApart,
  Feature,
  Value,
  Label,
}
