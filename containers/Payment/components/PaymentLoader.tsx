import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 20;
let timeLeft = TIME_LIMIT;
let remainingPathColor = COLOR_CODES.info.color;

// const Container = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     width: 300px;
//     height: 300px;
//     margin: 0 auto;
// `
// const LoaderContainer = styled.div`
//     width: 200px;
//     height: 200px;
//     border-radius: 50%;
//     border: 2px solid #d3d3d3;
//     display: flex;
//     align-items: center;
//     justify-content: center;
// `
const TimerContainer = styled.div`
.base-timer {
    position: relative;
    width: 300px;
    height: 300px;
  }
  
  .base-timer__svg {
    transform: scaleX(-1);
  }
  
  .base-timer__circle {
    fill: none;
    stroke: none;
  }
  
  .base-timer__path-elapsed {
    stroke-width: 7px;
    stroke: grey;
  }
  
  .base-timer__path-remaining {
    stroke-width: 7px;
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    fill-rule: nonzero;
    stroke: currentColor;
  }
  
  .base-timer__path-remaining.green {
    color: rgb(65, 184, 131);
  }
  
  .base-timer__path-remaining.orange {
    color: orange;
  }
  
  .base-timer__path-remaining.red {
    color: red;
  }
  
  .base-timer__label {
    position: absolute;
    width: 300px;
    height: 300px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
  }
`


const PaymentLoader = () => {
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timePassed, setTimePassed] = useState(0);
  
  function formatTimeLeft(time: number) {
    // The largest round integer less than or equal to the result of time divided being by 60.
    const minutes = Math.floor(time / 60);
    // Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds = time % 60;
    // If the value of seconds is less than 10, then display seconds with a leading zero
    let strSeconds = `${seconds}`;
    if (seconds < 10) {
      strSeconds = `0${seconds}`;
    }
    // The output in MM:SS format
    return `${minutes}:${strSeconds}`;
  }

  function onTimesUp() {
    if(timerInterval.current) clearInterval(timerInterval.current);
  }

  function setRemainingPathColor(timeLeft: number) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      document?.getElementById("base-timer-path-remaining")?.classList.remove(warning.color);
      document?.getElementById("base-timer-path-remaining")?.classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
      document?.getElementById("base-timer-path-remaining")?.classList.remove(info.color);
      document?.getElementById("base-timer-path-remaining")?.classList.add(warning.color);
    }
  }

  function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }

  
  useEffect(() => {
    function setCircleDasharray() {
      const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
      ).toFixed(0)} 283`;
      document?.getElementById("base-timer-path-remaining")?.setAttribute("stroke-dasharray", circleDasharray);
    }
    function startTimer() {
      timerInterval.current = setInterval(() => {
        setTimePassed(timePassed => {
          const newTimePassed = timePassed + 1;
          const timeLeft = TIME_LIMIT - newTimePassed;
          setCircleDasharray();
          setRemainingPathColor(timeLeft);
          if (timeLeft === 0) {
            onTimesUp();
          }
          return newTimePassed;
        })
      }, 1000);
    }
    startTimer();
  }, []);
  return (
    <TimerContainer>
      <div className="base-timer">
        <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g className="base-timer__circle">
            <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
              id="base-timer-path-remaining"
              strokeDasharray="283"
              className={`base-timer__path-remaining ${remainingPathColor}`}
              d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
              "
            ></path>
          </g>
        </svg>
        <span id="base-timer-label" className="base-timer__label">{formatTimeLeft(
          timeLeft
        )}</span>
      </div>
    </TimerContainer>
  );
}

export default PaymentLoader