import styled from "styled-components";
import { DropzoneComponent } from "react-dropzone-component";

export const ImageContainer = styled.div`
  width: 30%;
`;

export const Image = styled.img`
  max-width: 100%;
  height: 100%;
`;

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: var(--space-between);
`;

export const HeaderTextContainer = styled.div`
  padding-left: 15px;
  width: 70%;
  padding-right: 15px;
`;

export const HeaderText = styled.h3``;

export const BrandName = styled.div`
  font-size: 16px;
  line-height: 24px;
  font-family: "FuturaStd-Heavy";
  color: #39b54a;
  margin-top: 5px;
  letter-spacing: 1px;
`;

export const ModalBodyConatiner = styled.div`
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ebf0f2;
  min-height: 200px;
  position: relative;
`;

export const AddPowerheader = styled.div`
  display: flex;
  justify-content: var(--space-between);
`;

export const AddPowerText = styled.div``;

export const ReadInstruction = styled.a`
  background: #329c92;
  color: #fff;
  padding: 8px 20px;
  letter-spacing: 1px;
  margin-bottom: 15px;
  margin-right: 15px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
`;

export const PowerDetailsWrapper = styled.div``;

export const AddPowerTable = styled.div``;

export const PowerHead = styled.div`
  background: #eceeef;
  margin: 0;
  padding: 0;
  display: table;
  width: 100%;
  text-transform: uppercase;
`;

export const PowerHeading = styled.div`
  background: #384246;
  color: #fff;
  box-shadow: 2px 0 0 0 #fff, 0 2px 0 0 #fff, 2px 2px 0 0 #fff,
    inset 2px 0 0 0 #fff, inset 0 2px 0 0 #fff;
  font-family: 'LKFuturaStd-Medium';
  font-size: 11px;
  letter-spacing: 1.5px;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
  display: table-cell;
  width: 33.33%;
  padding: 12px 0 9px;
  text-align: center;
`;

export const PowerTableBlock = styled.div`
  background: #eceeef;
  margin: 0;
  padding: 0;
  display: table;
  width: 100%;
`;

export const PowerTableList = styled.div`
  margin: 0;
  padding: 0;
  display: table;
  width: 100%;
`;

export const PowerItemList = styled.div`
  color: #384246;
  text-align: center;
  list-style: none;
  box-shadow: 2px 0 0 0 #fff, 0 2px 0 0 #fff, 2px 2px 0 0 #fff,
    inset 2px 0 0 0 #fff, inset 0 2px 0 0 #fff;
  font-family: 'LKFuturaStd-Medium';
  font-size: 11px;
  letter-spacing: 1.5px;
  position: relative;
  cursor: pointer;
  display: table-cell;
  width: 33.33%;
  padding: 10px 0 7px;
`;

export const DropDownConatiner = styled.div`
  border: none;
  position: relative;
  padding: 10px 2px;
  border-radius: 4px;
`;

export const DropDownDisplay = styled.div`
  //width: calc(100% - 24px);
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 1;
  padding: 12px 0 9px;
  text-transform: uppercase;
  align-items: center;
`;

export const SpanData = styled.span`
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  line-height: 1;
`;

export const DropDownIcon = styled.i`
  position: absolute;
  right: 12px;
  padding-top: 0;
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  background: url(https://static.lenskart.com/skin/frontend/base/default/img/sprite-v2.png)
    no-repeat 0 0;
  vertical-align: baseline;
  &::before {
  }
`;

export const UpArrow = styled.span`
  border: 5px solid var(--transparent);
  border-top: 5px solid var(--dark-grey);
  margin-top: -10px;
  float: right;
`;

export const DownArrow = styled.span`
  border: 5px solid var(--transparent);
  border-bottom: 5px solid var(--dark-grey);
  margin-top: -15px;
  float: right;
`;

export const IhaveCylTextContainer = styled.div`
  padding-top: 15px;
`;

export const IhaveCylLabel = styled.label`
  font-family: FuturaStd-Book;
  color: #384246;
  letter-spacing: 0.75px;
  font-size: 14px;
  cursor: pointer;
  text-transform: capitalize;
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 700;
  margin-left: 30px;
`;

export const IhaveCylInput = styled.input`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  nput[type="checkbox"] {
    margin: 4px 0 0;
    line-height: normal;
  }
  user-select: initial;
	&::before, &::after {
    	user-select: initial;
	}
`;

export const SubmitEyePowerConatiner = styled.button<{ disable: boolean }>`
  margin: 0 auto;
  display: block;
  margin-top: 20px;
  background: ${(props) => (props.disable ? "#d8d8d8;" : "#1cbbb4")};
  padding: 15px 30px 11px;
  border-radius: 5px;
  font-size: 16px;
  font-family: FuturaStd-Heavy;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  line-height: 20px;
  color: #fff;
  text-decoration: none;
  box-shadow: ${(props) =>
    props.disable ? "0 1px 0 #cecece" : "0 3px 0 #19a8a2"};
  border-color: transparent;
  cursor: pointer;
`;

export const PreviewPrescriptionView = styled.div``;

export const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  background-position: -1001px -40px;
  background-image: url(https://static.lenskart.com/media/wysiwyg/sccess/sprite-10.png);
  margin: 15px auto;
`;

export const PreviewText = styled.p`
  text-align: center;
  font-size: 16px;
  line-height: 24px;
  font-family: FuturaStd-Book;
  letter-spacing: 1px;
  padding-bottom: 10px;
  margin: 0 0 10px;
`;

export const ContinueButton = styled.button`
  margin: 0 auto;
  display: block;
  margin-top: 20px;
  background: #1cbbb4;
  padding: 15px 30px 11px;
  border-radius: 5px;
  font-size: 16px;
  font-family: FuturaStd-Heavy;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  line-height: 20px;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 3px 0 #19a8a2;
  border-color: transparent;
`;

export const BackButton = styled.div`
  color: #329c92;
  text-decoration: none;
  cursor: pointer;
`;

export const PrescriptionWrapper = styled.div`
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ebf0f2;
  min-height: 200px;
  position: relative;
  margin: 20px auto auto;
  overflow: scroll;
  height: 530px;
`;

export const UploadPresTab = styled.div``;

export const UploadPresText = styled.p`
  color: #464648;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 15px;
  margin: 10px 0px;
  text-align: center;
`;

export const FileContainer = styled.div`
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
  width: 100%;
`;

// export const FilePickr = styled.div`
// 	text-align: center;
// 	padding: 5px;
// 	background-color: #e1e1e1;
// 	border-radius: 5px;
// 	min-height: 60px;
// 	border: 2px dashed #c7c7c7;
// 	font-family: sans-serif;
// 	cursor: pointer;
// `;

export const SuccessAuthText = styled.p`
  color: #39b54a;
  margin: 0 auto 10px;
  font-size: 16px;
  text-align: center;
  text-transform: none;
  width: 44%;
  line-height: 24px;
  font-family: FuturaStd-Book;
  letter-spacing: 1px;
  padding-bottom: 10px;
`;

export const ExecuteMessage = styled.p`
  font-size: 16px;
  text-align: center;
  color: #445962;
  text-transform: none;
  width: 44%;
  margin: 0 auto;
  line-height: 24px;
  font-family: FuturaStd-Book;
  letter-spacing: 1px;
  padding-bottom: 10px;
`;

export const EamilTextMessage = styled.p`
  font-size: 16px;
  text-align: center;
  color: #445962;
  text-transform: initial;
  width: 64%;
  margin: 0 auto;
  ine-height: 24px;
  font-family: FuturaStd-Book;
  letter-spacing: 1px;
  padding-bottom: 10px;
`;

export const EamilTextSupportIconWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const EamilIconText = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 50px 40px;
  align-items: center;
  list-style: none;
  border: 1px solid #d9dedf;
`;

export const EamilSupportIcon = styled.div`
  background-position: -882px -90px;
  width: 61px;
  height: 51px;
  float: left;
  background-color: #f3f8fa;
  padding: 5px 20px;
  border-right: 1px solid #d9dedf;
  background-image: url(https://static.lenskart.com/media/wysiwyg/sccess/sprite-10.png);
  margin: 15px auto;
`;

export const EamilSupport = styled.div`
  font-size: 16px;
  padding: 0px 40px;
`;

export const SupportStrong = styled.strong`
  color: #445962;
  font-family: "FuturaStd-Heavy";
  font-weight: normal;
`;

export const StyledDropZoneComponent = styled(DropzoneComponent)`
	&.filepicker {
    text-align: center;
    padding: 5px;
    background-color: #e1e1e1;
    border-radius: 5px;
    min-height: 60px;
    border: 2px dashed #c7c7c7;
    font-family: sans-serif;
	cursor: pointer;
    .filepicker-file-icon {
      position: relative;
      display: inline-block;
      margin: 1.5em 0 2.5em 0;
      padding-left: 45px;
      color: black;
      &::before {
        position: absolute;
        top: -7px;
        left: 0;
        width: 29px;
        height: 34px;
        content: "";
        border: solid 2px #7f7f7f;
        border-radius: 2px;
      };
      &::after {
        font-size: 11px;
        line-height: 1.3;
        position: absolute;
        top: 9px;
        left: -4px;
        padding: 0 2px;
        content: "file";
        content: attr(data-filetype);
        text-align: right;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #fff;
        background-color: #000;
      };
      .fileCorner {
        position: absolute;
        top: -7px;
        left: 22px;
        width: 0;
        height: 0;
        border-width: 11px 0 0 11px;
        border-style: solid;
        border-color: white transparent transparent #920035;
      }
    };
    .dz-default {
      &.dz-message {
		text-align: center;
		margin: 2em 0;
        &:before {
          background: #3bb3a9;
          color: #fff;
          padding: 10px;
          content: "Drop files here to upload/ Click to Upload";
        };
        span {
          display: none;
        };
      };
    };
	&.dropzone {
		text-align: center;
		.dz-preview {
			margin: auto;
			margin-left: 13px;
			margin-bottom: 10px;
		};
		.dz-error-message {
			display: none !important;
		};
	};
`;

export const UploadSuccessMessage = styled.div`
  margin-top: 15px;
  text-align: center;
  color: #1cbbb4;
  font-size: 14px;
`;

export const UploadErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
`;

export const PrescriptionImage = styled.img`
  width: 50%;
  height: 50%;
`;

export const CenterImg = styled.div`
  display: flex;
  justify-content: center;
`;
