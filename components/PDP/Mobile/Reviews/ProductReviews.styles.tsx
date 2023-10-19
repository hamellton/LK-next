import { TypographyENUM } from "@/types/baseTypes";
import styled from "styled-components";

export const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: var(--white);
  padding: 5px;
  margin-top: 10px;
`;
export const ReviewUpperWrapper = styled.div`
  display: flex;
  padding: 10px 0 0;
  justify-content: space-between;
  button {
    margin-right: inherit;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 2px 0px;
    background: none;
    border: none;
    color: #000042;
    padding: 5px 10px;
    font-family: ${TypographyENUM.lkSansBold};
  }
`;

export const ReviewFormContainer = styled.div`
  position: relative;
`;
export const CrossWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`;

export const Text = styled.div`
  color: #000042;
  font-weight: var(--fw-regular);
  font-size: var(--fs-16);
  font-family: ${TypographyENUM.lkSansBold};
  margin: 5px;
`;

export const ReviewCardWrapper = styled.div`
  margin: 0 10px;
  padding: 5px 0 12px;
`;

export const ReviewRatingWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 0 15px;
  gap: 20px;
  margin-bottom: -12px;
`;

export const AverageRatingsWrapper = styled.div`
  width: 45%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
export const ReviewPercentageWrapper = styled.div`
  display: flex;
  border-left: 1px solid var(--border);
  padding-left: 20px;
  padding-bottom: 20px;
  flex-direction: column;
  width: 55%;
  gap: 8px;
  min-height: 130px;
  font-family: ${TypographyENUM.lkSansBold};
`;

export const AverageRatingsTitle = styled.div`
  width: 100%;
  font-size: 14px;
  font-family: ${TypographyENUM.lkSansBold};
  text-transform: uppercase;
`;
export const AverageRatingsNumber = styled.span`
  background: #28c7bf;
  padding: 6px 10px;
  border-radius: 6px;
  display: flex;
  margin: auto;
  font-size: 22px;
  color: #fff;
  gap: 15px;
  font-family: ${TypographyENUM.lkSansBold};
  align-items: center;
`;
export const AverageRatingsTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b6d76;
  font-family: ${TypographyENUM.lkSansRegular};
`;

export const AverageNumber = styled.span`
  padding: 0 5px;
`;


export const PaginationContainer = styled.div`
  align-self: center;
`