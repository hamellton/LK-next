export interface PanZoomContainerTypes{
	images: ImageType
	onCloseHandler: () => void
}

interface ImageType{
	altText:string
	source:string
	redirectUrl:string
}