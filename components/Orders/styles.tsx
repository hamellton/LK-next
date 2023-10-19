import { TypographyENUM } from "@/types/baseTypes";
import styled, { css } from "styled-components";
export const OuterContainer = styled.div`
  align-items: center;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
`;

export const SelectOuter = styled.div`
  width: 400px;
  padding: 10px;
  border: 1px solid #c3c3c3;
  border-radius: 4px;
`;

export const ProductId = styled.div`
  color: #999999;
  font-size: 12px;
  line-height: 17.5px;
`;

export const BrandName = styled.div`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 7px;
  margin-top: 4px;
`;
export const TextTransform = styled.span`
  text-transform: capitalize;
`;
export const Price = styled.div`
  font-size: 14px;
  margin-top: 10px;
  color: #999999;
`;
export const Header = styled.div`
  margin-left: 12px;
  text-align: center;
`;
export const Texth4 = styled.h4`
  text-align: left;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
`;

export const Body = styled.div`
  margin-left: 12px;
`;
export const ImgOuter = styled.div`
  margin-left: 12px;
  margin-top: 12px;
  display: flex;
  img {
    margin-top: 15px;
  }
`;

export const SelectTop = styled.div`
  display: flex;
  margin-left: 20px;
  justify-content: space-between;
  img {
    display: block;
    flex: 1;
  }
`;
export const Divmr = styled.div`
  margin-right: 5px;
`;
export const CardFooter = styled.div<{ leftMargin: boolean }>`
  text-align: left;
  color: #999999;
  font-size: 14px;
  margin-top: 15px;
  ${(props) =>
    props.leftMargin &&
    css`
      margin-left: 20px;
    `}
`;

/////////////////////exchange double

export const Outer = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  // border: 1px solid #dddddd;
  border-radius: 10px;
  margin-left: 12px;
  margin-right: 12px;
  // padding: 10px;
`;
export const DoubleLeft = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
  margin-right: 10px;
  margin-left: 10px;
`;

///////////////////////////////////////////////////

export const LeftOuter = styled.div`
  width: 70vw;
  margin-right: 5px;
`;

export const LeftOuterMost = styled.div`
  border: 1px solid #dddddd;
  border-radius: 8px;
  margin: 10px;
`;

export const LeftRoot = styled.div`
  margin-bottom: 10px;
`;
export const HeaderLeft = styled.div<{ background: boolean }>`
  background-color: ${(props) =>
    props.background ? "rgba(0, 185, 198, 0.08)" : "none"};
  color: ${(props) => (props.background ? "black" : "#999999")};
  padding: 15px;
  display: flex;
  justify-content: space-between;
  line-height: 1.43;
`;
export const HeaderText = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

export const InputOuter = styled.div`
  margin: 10px auto;
`;

///////////////////////////

export const Root = styled.div`
  width: 30vw;
  height: fit-content;
  margin-left: 5px;
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #dddddd;
  border-radius: 8px;
`;

///////////////////ReturnProductDetails

export const Heading = styled.div<{ exchangewith: boolean }>`
  border: 1px solid #ebebeb;
  border-radius: 10px;
  padding: 3px;
  text-align: center;
  font-size: 13px;
  color: ${(props) => (props.exchangewith ? "green" : "")};
`;
export const LKDivider = styled.div`
  width: 1px;
  background: #ebebeb;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: 10px;
`;
export const DividerImg = styled.div`
  //   position: relative;
  //   left: -4%;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
`; //////////////Return mode////////////
export const CardImg = styled.img`
  color: #fff;
  background: #00b9c6;
  border-radius: 100%;
`;
export const BorderBottom = styled.div<{ isBottom: boolean }>`
  border-bottom: ${(props) => (props.isBottom ? "1px solid #ebebeb" : "")};
  padding-bottom: 10px;
`;

export const OuterInput = styled.div<{ disable: boolean }>`
  text-color: ${(props) => (props.disable ? "#999999" : "")};
  display: flex;
  align-items: center;
`;
export const Icon = styled.img<{ disable: boolean }>`
  margin: 8px;
  margin-left: 25px;
  max-width: 100%;
  cursor: ${(props) => (props.disable ? "no-drop" : "pointer")};
`;
export const Info = styled.div<{ disable: boolean }>`
  width: 100%;
  margin-top: 15px;
  cursor: ${(props) => (props.disable ? "no-drop" : "pointer")};
`;
export const ReturnType = styled.span`
  font-weight: 600;
  font-size: 14px;
  margin-left: 40px;
`;
export const Badge = styled.span`
  border-radius: 16px;
  color: #3b873e;
  background-color: #fff;
  border: 1px solid rgba(76, 175, 80, 0.5);
  font-family: Roboto;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.16px;
  padding: 0 6px;
  margin-left: 15px;
`;

export const List = styled.li`
  color: #999999;
  font-size: 12px;
  list-style-type: none;
  margin-left: 40px;
`;

//////////////////////Sidebar/////////////

export const Sidebar = styled.div<{ disabled: boolean }>`
  display: ${(props) => (props.disabled ? "block" : "none")};
  height: 100%;
  right: 0;
  width: 50%;
  // left: 0;
  background-color: #fff;
  // opacity: 0.6;
  position: fixed;
  z-index: 1000;
  top: 0;
  overflow: auto;
  border-left: 1px solid #ccc;
`;
export const BackdropContainer = styled.div<{ disabled: boolean }>`
  display: ${(props) => (props.disabled ? "block" : "none")};
  height: 100%;
  position: fixed;
  right: 0;
  width: 100%;
  background-color: #000;
  opacity: 0.6;
  z-index: 200;
  top: 0;
  overflow: auto;
  border-left: 1px solid #ccc;
`;

//////////////changebutton

export const ChangeButton = styled.span`
  color: #329c92;
  cursor: pointer;
  font-size: 12px;
`;

export const SummaryOuter = styled.div`
  margin-top: -15px;
  padding: 15px;
  margin-left: 15px;
  padding-top: 0;
  font-size: 13px;
`;

export const SummaryOuterMarNeg = styled.div`
  margin-top: -5px;
  padding: 15px;
  margin-left: 15px;
  padding-top: 0;
  font-size: 13px;
`;

export const Lightcolor = styled.span`
  color: #999999;
`;

export const RootBox = styled.div`
  width: 1188px;
  max-width: 1188px;
  padding: 20px auto;
  display: flex;
  flex-direction: row;
  margin-top: 30px;
`;

export const LeftMarDiv = styled.div`
  margin-left: 20px;
`;

export const Div = styled.div`
  display: flex;
  align-items: center;
`;

export const Free = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const P = styled.p`
  font-size: 13px;
  margin-left: 31px;
`;

export const PadDiv = styled.div`
  text-align: left;
  background-color: rgb(212 234 213);
  padding: 2px;
  padding-left: 12px;
  padding-bottom: 5px;
`;

export const FontDiv = styled.div`
  font-size: 20px;
`;

export const Image = styled.img``;
