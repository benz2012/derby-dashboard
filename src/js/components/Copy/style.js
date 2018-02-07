import styled, { keyframes } from 'styled-components'

const fadeInAndOut = keyframes`
  0% {
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const Container = styled.div`
  position: fixed;
  width: 120px;
  height: 150px;
  left: calc(50% - 60px);
  top: calc(35% - 75px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: white;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 12px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  animation: ${fadeInAndOut} 3s 1 ease-in-out both;
`

const Icon = styled.div`
  flex: 3;
  display: flex;
  align-items: center;
`

const Text = styled.div`
  flex: 2;
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  padding: 5px 10px;
`

export {
  Container,
  Icon,
  Text,
}
