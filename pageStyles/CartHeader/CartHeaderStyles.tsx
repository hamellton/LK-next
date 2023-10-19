import exp from "constants";
import styled from "styled-components";

export const CartHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 2000px;
  min-width: 1200px;
  margin: 0 auto;
  padding: 0 12%;
  width: 100%;
  @media screen and (max-width: 1150px) {
    min-width: 900px;
    padding: 0 4%;
  }
  /* @media screen and (min-width: 1000px) and (max-width: 1600px) { */
  /* margin: 0 5vw; */
  /* } */
  /* @media screen and (min-width: 1240px) and (max-width: 1600px) {
        margin: 0 5vw;
        padding: 0 25px;
    }
    @media screen and (max-width: 1240px) {
        padding: 0 30px 0 80px;
    } */
  /* background-color: var(--white); */
`;
export const CartHeaderHolder = styled.div`
  /* display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between; */
  background-color: var(--white);
  /* margin: 0 auto; */
`;

export const CartHeaderLogo = styled.div`
  /* margin-left: 10vw; */
  /* padding: 0 50px; */
  cursor: pointer;
  margin: 0 -20px;
  /* border: 2px solid black; */
  /* @media screen and (max-width: 1240px) {
        padding: 0 25px;
    } */
`;

export const CartHeaderSafeLogo = styled.div`
  /* margin-right: 20vw;  */
  display: flex;
  /* padding: 0 30px; */
`;

export const CartHeaderText = styled.div`
  font-size: var(fs-16);
  line-height: 24px;
  letter-spacing: -0.02em;
  font-family: var(--font-default-book);
  font-synthesis: none;
  font-weight: var(--fw-regular);
  margin: auto var(--pd-10);
  color: var(--dark-blue-75);
`;
