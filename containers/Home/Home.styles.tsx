import styled from "styled-components";

export const HomeWrapper = styled.div``;

export const FooterWrapper = styled.div`
  background-color: #000042;
  padding: 20px 40px;
  p {
    margin: 0 0 10px !important;
    letter-spacing: -0.02em;
    font-size: 14px;
  }
  .txt-strong {
    padding-bottom: 15px !important;
    font-family: "LKSans-Medium";
    font-size: 32px;
    line-height: 40px;
    letter-spacing: -0.3px;
    color: #f4f4f4;
  }
  .eyewer-text,
  .footer-eyewer-text {
    p {
      font-family: "LKSans-Regular";
      line-height: 20px;
      font-size: 14px;
      letter-spacing: -0.02em;
      color: #fcfcfc;
      a {
        color: #329c92;
      }
    }
  }
  .footer-eyewer-text {
    font-family: "LKSans-Regular";
    line-height: 1.5;
    font-size: 12px;
    letter-spacing: 0;
    a {
      color: #329c92;
    }
    p {
      line-height: 1.5;
      font-size: 12px;
      letter-spacing: 0;
    }
  }
`;

export const MobilViewWrapper = styled.div`
  background-color: #f6f6f6;
`;
