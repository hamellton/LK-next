export interface ReviewsType {
    count: number,
    reviews: ReviewItem[] | null,
    pageCount: number,
    pageSize: number;
    rating?: number,
    reviewGraph?:{
        percentage:number,
        stars:number
    }[]
}

export interface ReviewItem {
    reviewId: string | number,
    reviewTitle: string,
    reviewDetail: string,
    reviewee: string,
    reviewDate: string,
    noOfStars: number,
    images: string[]
}