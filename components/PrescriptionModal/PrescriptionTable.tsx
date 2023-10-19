import {
	PowerDetailsWrapper,
	AddPowerTable,
	PowerHead,
	PowerHeading,
	PowerTableBlock,
	PowerTableList,
	PowerItemList
} from './styles';

interface PrescriptionTableType {
	dataLocale: any;
	powerDetails: any;
}

const PrescriptionTable = ({ dataLocale, powerDetails }: PrescriptionTableType) => {
	return (
		<PowerDetailsWrapper>
			<AddPowerTable>
				<PowerHead>
					<PowerHeading>{dataLocale.EYE}</PowerHeading>
					<PowerHeading>{dataLocale.RIGHT_EYE}</PowerHeading>
					<PowerHeading>{dataLocale.LEFT_EYE}</PowerHeading>
				</PowerHead>
			</AddPowerTable>
			<PowerTableBlock>
				<PowerTableList>
					<PowerHeading>{dataLocale.SPHERICAL}</PowerHeading>
					<PowerItemList>{powerDetails?.right?.sph || '-'}</PowerItemList>
					<PowerItemList>{powerDetails?.left?.sph || '-'}</PowerItemList>
				</PowerTableList>
			</PowerTableBlock>
			<PowerTableBlock>
				<PowerTableList>
					<PowerHeading>{dataLocale.CYLINDRICAL}</PowerHeading>
					<PowerItemList>{powerDetails?.right?.cyl || '-'}</PowerItemList>
					<PowerItemList>{powerDetails?.left?.cyl || '-'}</PowerItemList>
				</PowerTableList>
			</PowerTableBlock>
			<PowerTableBlock>
				<PowerTableList>
					<PowerHeading>{dataLocale.AXIS}</PowerHeading>
					<PowerItemList>{powerDetails?.right?.axis || '-'}</PowerItemList>
					<PowerItemList>{powerDetails?.left?.axis || '-'}</PowerItemList>
				</PowerTableList>
			</PowerTableBlock>
			<PowerTableBlock>
				<PowerTableList>
					<PowerHeading>{dataLocale.AP}</PowerHeading>
					<PowerItemList>{powerDetails?.right?.ap || '-'}</PowerItemList>
					<PowerItemList>{powerDetails?.left?.ap || '-'}</PowerItemList>
				</PowerTableList>
			</PowerTableBlock>
		</PowerDetailsWrapper>
	);
};

export default PrescriptionTable;
