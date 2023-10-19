import {
	DropDownList,
	ItemList,
	NegativeList,
	PowerList,
	PositiveList,
	ItemWithFullWidth,
	PowerValueDiv
} from './DropDwonStyles';

enum direction {
	right = 'right',
	left = 'left'
}

interface DropDownType {
	list: any;
	setOpenList: (params: string) => void;
	direction: direction;
	type: string;
	slectedPower: (value: string | number, direction: direction, type: string) => void;
}

const DropDown = ({ list, setOpenList, direction, type, slectedPower }: DropDownType) => {
	const powerValueType = (value: string | number, direction: direction, type: string) => {
		slectedPower(value, direction, type);
		setOpenList('');
	};
	return (
		<DropDownList>
			<PowerList>
				<ItemWithFullWidth onClick={() => setOpenList('')}>
					{list &&
						list.map((item: any, index: number) => {
							if (item === '0.00' || item === '0' || item === 0.0 || item === 0) {
								return (
									<ItemList
										key={`zero_${index}`}
										onClick={() => powerValueType(item, direction, type)}
									>
										<PowerValueDiv>{item}</PowerValueDiv>
									</ItemList>
								);
							}
						})}
				</ItemWithFullWidth>
				<NegativeList>
					{list &&
						list.map((item: any, index: number) => {
							if (item < 0 && type !== 'axis') {
								return (
									<ItemList
										key={`negative_${index}`}
										onClick={() => powerValueType(item, direction, type)}
									>
										<PowerValueDiv>{item}</PowerValueDiv>
									</ItemList>
								);
							}
							if (type === 'axis' && item <= 90 && item > 0) {
								return (
									<ItemList
										key={`negative_${index}`}
										onClick={() => powerValueType(item, direction, type)}
									>
										<PowerValueDiv>{item}</PowerValueDiv>
									</ItemList>
								);
							}
						})}
				</NegativeList>
				<PositiveList>
					{list &&
						list.map((item: any, index: number) => {
							if (item > 0 && type !== 'axis') {
								return (
									<ItemList
										key={`positive_${index}`}
										onClick={() => powerValueType(item, direction, type)}
									>
										<PowerValueDiv>{item}</PowerValueDiv>
									</ItemList>
								);
							}
							if (type === 'axis' && item > 90 && item <= 180) {
								return (
									<ItemList
										key={`positive_${index}`}
										onClick={() => powerValueType(item, direction, type)}
									>
										<PowerValueDiv>{item}</PowerValueDiv>
									</ItemList>
								);
							}
						})}
				</PositiveList>
			</PowerList>
		</DropDownList>
	);
};

export default DropDown;
