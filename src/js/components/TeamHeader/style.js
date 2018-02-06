import styled from 'styled-components'

const Container = styled.div`
`

const Buttons = styled.div`
  display: flex;
  align-items: center;
`

const CoverImage = styled.img`
  width: 100%;
  margin: auto;
  display: block;
`

const TeamBlockText = styled.div`
  margin-left: 14px;
  margin-bottom: 4px;
`

const TeamName = styled.div`
  font-size: 28px;
  font-weight: 700;
`

const TeamSubName = styled.div`
  font-size: 18px;
  color: ${props => props.theme.textDampen}
`

export {
  Container,
  Buttons,
  CoverImage,
  TeamBlockText,
  TeamName,
  TeamSubName,
}
