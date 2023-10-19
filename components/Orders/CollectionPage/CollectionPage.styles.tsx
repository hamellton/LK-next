import styled from "styled-components";

export const CollectionWrapper = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background: white;
    height: 100vh;
    border-left: 1px solid #999999;
    width: 50%;
    overflow: scroll;
    z-index: 1000;
`;
export const CollectionHeader = styled.div`
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
export const TopHead = styled.div`
    font-weight: 500;
    padding: 20px;
    font-size: 20px;
`;
export const Heading = styled.h4`
    font-weight: 400;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 18px;
    text-align: center;
    padding-top: 2%;
`;
export const HeadingContainer = styled.div`
    font-weight: 500;
    padding: 0;
    font-size: 20px;
    padding-top: 16px;
    padding-bottom: 8px;
`;
export const SubHead = styled.div`
    color: #999999;
    font-size: 14px;
    font-weight: 400;
    margin-top: 2px;
    margin-bottom: 6px;
`;
export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-color: rgb(230, 239, 248);
`;

export const Outer = styled.div`
    width: 49%;
    padding: 1%;
    display: flex;
    height: 100%;
    a {
        height: 100%;
        width: 100%;
    }
    img {
        display: block;
        max-width: 100%;
        vertical-align: middle;
        height: 100%;
        width: 100%;
    }
`;

export const CollectionBody = styled.div`
    background-color: rgb(230, 239, 248);
    padding-bottom: 12px;
`;