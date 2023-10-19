import { PackageENUM } from "@/types/productDetails";

export const getPackageVisibility = (classification: string) => {
	if(classification === "sunglasses") {
		return [
			{
				type: PackageENUM.PACKAGES,
				selectedText: "",
				showSection: true,
				isActive: true
			},
			{
				type: PackageENUM.EYESIGHT,
				selectedText: "",
				showSection: true,
				isActive: false
			}
		];
	}

	return [
		{
			type: PackageENUM.POWER,
			selectedText: "",
			showSection: true,
			isActive: true
		},
		{
			type: PackageENUM.PACKAGES,
			selectedText: "",
			showSection: true,
			isActive: false
		},
		{
			type: PackageENUM.EYESIGHT,
			selectedText: "",
			showSection: true,
			isActive: false
		}
	];

};
