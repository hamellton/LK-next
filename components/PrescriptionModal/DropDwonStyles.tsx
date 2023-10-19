import styled from 'styled-components';

export const DropDownList = styled.div`
	max-height: 250px;
	background: #384246;
	border: none;
	border-bottom: 2px solid #fff;
	color: #dadad4;
	width: 100%;
	left: 0;
	top: -2px;
	position: absolute;
	overflow-y: auto;
	z-index: 9;
`;

export const PowerList = styled.div`
	box-sizing: border-box;
	margin: 0;
	padding: 0;
`;

export const ItemWithFullWidth = styled.ul`
	width: 100%;
	border-bottom: 0;
	margin: 0;
	padding: 0;
	list-style-type: none;
	color: #333;
	cursor: pointer;
`;

export const ItemList = styled.li`
	width: 100%;
	background: 0 0;
	color: #fff;
	box-shadow: 2px 0 0 0 #fff, 0 2px 0 0 #fff, 2px 2px 0 0 #fff, inset 2px 0 0 0 #fff, inset 0 2px 0 0 #fff;
	border-bottom: 0;
`;

export const NegativeList = styled.ul`
	flex-direction: column;
	width: 50%;
	display: flex;
	margin: 0;
	padding: 0;
	list-style-type: none;
	float: left;
`;

export const PositiveList = styled.ul`
	flex-direction: column;
	width: 50%;
	display: flex;
	margin: 0;
	padding: 0;
	list-style-type: none;
	float: left;
`;

export const PowerValueDiv = styled.div`padding: 10px 7px;`;
