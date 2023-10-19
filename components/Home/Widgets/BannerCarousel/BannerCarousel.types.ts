export interface BannerCarouselType {
  bannerCarouselData: {}[];
  courselConfig: courselConfigType;
  mobileView: boolean;
  showCategoryCard: (
    categoryCards: any,
    contentType: string,
    cardCategory: string
  ) => void;
  hideArrow?: boolean;
  isScrollable?: boolean;
  className?: string;
}

interface courselConfigType {
  slidesToShow: number;
  autoPlay: boolean;
  autoplaySpeed: number;
  infinite?: boolean;
}
