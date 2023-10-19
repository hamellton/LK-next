import React from 'react'
import styled, {keyframes} from 'styled-components';

const loading = keyframes`
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1, 2.2);
    }
    40% {
      transform: scale(1);
    }
`
const BarContainer = styled.div`
    width: 152px;
    height: 52px;
    border-radius: 4px;
    background: #ffffff;
    border: 1px solid rgba(220, 214, 214, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
`;
const LoadingBar = styled.div`
    width: 4px;
    height: 18px;
    animation: ${loading} 1s ease-in-out infinite;
    margin: 0 2px;
    &:nth-child(1) {
    background-color: #3498db;
    animation-delay: 0;
    }
    &:nth-child(2) {
    background-color: #c0392b;
    animation-delay: 0.09s;
    }
    &:nth-child(3) {
    background-color: #f1c40f;
    animation-delay: 0.18s;
    }
    &:nth-child(4) {
    background-color: #27ae60;
    animation-delay: 0.27s;
    }
`

const BarLoader = () => {
  return (
    <BarContainer>
        <LoadingBar/>
        <LoadingBar/>
        <LoadingBar/>
        <LoadingBar/>
    </BarContainer>
  )
}

export default BarLoader