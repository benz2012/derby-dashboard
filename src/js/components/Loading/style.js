import styled, { keyframes } from 'styled-components'

const Container = styled.div`
  margin: 150px auto 0 auto;
  width: 100px;
  text-align: center;
`

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
`

const Dot = styled.div`
  width: 18px;
  height: 18px;
  margin: 0 3px;
  background-color: ${props => props.theme.headerBG};

  border-radius: 100%;
  display: inline-block;
  animation: ${bounce} 1.4s infinite ease-in-out both;

  animation-delay: ${props => props.delay};
`

const WaitingText = styled.div`
  margin: 20px auto 0 auto;
  width: 50%;
  text-align: center;
  font-weight: 700;
  font-size: 24px;
  color: ${props => props.theme.textDampen};
`

export {
  Container,
  Dot,
  WaitingText,
}
