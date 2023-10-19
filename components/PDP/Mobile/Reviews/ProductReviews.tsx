import { AppDispatch, RootState } from "@/redux/store";
import {
  ComponentSizeENUM,
  DeviceTypes,
  ThemeENUM,
  TypographyENUM,
} from "@/types/baseTypes";
import { ReviewMobile } from "@lk/ui-library";
import { ReviewCardMobile } from "@lk/ui-library";
import { ReviewProgressBar } from "@lk/ui-library";
import { Divider } from "@lk/ui-library";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AverageNumber,
  AverageRatingsNumber,
  AverageRatingsTitle,
  AverageRatingsTotal,
  AverageRatingsWrapper,
  CrossWrapper,
  PaginationContainer,
  ReviewCardWrapper,
  ReviewContainer,
  ReviewFormContainer,
  ReviewPercentageWrapper,
  ReviewRatingWrapper,
  ReviewUpperWrapper,
  Text,
} from "./ProductReviews.styles";
import { PDP as PDPComponents } from "@lk/ui-library";
import { ProductReviewTypes } from "./ProductReview.types";
import { PrimaryButton } from "@lk/ui-library";
import { Icons } from "@lk/ui-library";
import {
  dispatchFetchMoreReviews,
  dispatchPostReview,
  resetReviewData,
} from "@/redux/slices/productDetailInfo";
import { Pagination } from "@lk/ui-library";
import { ProductDetailType } from "@/types/productDetails";
import { DataType } from "@/types/coreTypes";

export interface ProductReviewType {
  localeData: DataType;
  productDetailData: ProductDetailType;
}

const ProductReviews = ({
  localeData,
  productDetailData,
}: ProductReviewType) => {
  const {
    WRITE_REVIEW,
    REVIEWS_AND_RATINGS,
    THIS_FIELD_IS_REQUIRED,
    INVALID_MAIL,
    INVALID_LENGTH,
  } = localeData;
  const {
    reviewsData,
    reviewsLoading,
    percentage,
    reviewMessage,
    reviewLoading,
    reviewError,
  } = useSelector((state: RootState) => state.productDetailInfo);
  const { rating, reviews } = reviewsData;

  const dispatch = useDispatch<AppDispatch>();
  const sessionId = useSelector((state: RootState) => state.userInfo.sessionId);
  const newReviews: any = [];
  productDetailData?.reviews?.reviews?.map((item: any) => {
    let obj = {
      reviewId: item.id,
      reviewTitle: item.title,
      reviewDetail: item.desc,
      reviewee: item.userName,
      noOfStars: item.rating,
      reviewDate: item.date,
      images: item.images,
      reviewerType: "verified_reviewer",
    };
    newReviews.push(obj);
  });

  // >  component states
  const [showReview, setShowReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsToRender, setReviewsToRender] = useState(newReviews);
  const [formValues, setFormValues] = useState({});
  const [errorMessage, setErrorMessage] = useState<any>({
    email: "",
    reviewDetail: "",
    name: "",
    title: "",
    noOfStars: "",
  });

  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const errors = (val: string, type: string) => {
    if (
      !val ||
      (typeof val === "number" && val === 0) ||
      (typeof val === "string" && val.trim().length === 0)
    ) {
      return THIS_FIELD_IS_REQUIRED;
    }
    if (type === "name") {
    } else if (type === "emailData") {
      if (!val.match(mailformat)) {
        return INVALID_MAIL;
      }
    } else if (type === "review") {
      if (val.length < 6) {
        return INVALID_LENGTH;
      }
    }
    return "";
  };

  const formValidation = (val: any) => {
    const type = Object.keys(val)[0];
    let isError = false;
    if (type === "name") {
      const nameError = errors(val.name, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, name: nameError };
      });
      if (nameError) isError = true;
    }
    if (type === "emailData") {
      const emailError = errors(val.emailData, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, email: emailError };
      });
      if (emailError) isError = true;
    }
    if (type === "title") {
      const titleError = errors(val.title, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, title: titleError };
      });
      if (titleError) isError = true;
    }
    if (type === "review") {
      const reviewError = errors(val.review, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, reviewDetail: reviewError };
      });
      if (reviewError) isError = true;
    }
    if (type === "noOfStars") {
      const noOfStarsError = errors(val.noOfStars, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, noOfStars: noOfStarsError };
      });
      if (noOfStarsError) isError = true;
    }
    return isError;
  };

  const onSubmit = (formData: any) => {
    let isError = false;
    isError = formValidation({ emailData: formData.email }) || isError;
    isError =
      formValidation({
        review: formData.review.reviewDetail,
      }) || isError;
    isError =
      formValidation({
        title: formData.review.reviewTitle,
      }) || isError;
    isError =
      formValidation({
        name: formData.review.reviewee,
      }) || isError;
    isError =
      formValidation({
        noOfStars: formData.review.noOfStars,
      }) || isError;

    if (!isError) {
      submitForm(formData);
    }
  };

  const submitForm = (formData: any) => {
    if (productDetailData) {
      dispatch(
        dispatchPostReview({
          pid: productDetailData?.id,
          email: formData.email,
          review: formData.review,
          sessionId,
        })
      );
    }
  };

  const handleOnPageClick = (current: number) => {
    setCurrentPage(current + 1);
  };

  useEffect(() => {
    if (sessionId && productDetailData?.id) {
      dispatch(
        dispatchFetchMoreReviews({
          pid: productDetailData?.id,
          pageSize:
            process.env.NEXT_PUBLIC_APP_CLIENT === DeviceTypes.MOBILE ? 5 : 10,
          nextPage: currentPage.toString(),
          sessionId: sessionId,
        })
      );
    }
  }, [currentPage]);

  useEffect(() => {
    const renderReviews = reviews?.slice(-5);
    setReviewsToRender(renderReviews);
  }, [reviews, currentPage]);

  function handleClose() {
    dispatch(resetReviewData());
    setShowReview(false);
  }

  // if (rating === undefined) return null;

  return (
    <>
      <ReviewContainer id="review-container">
        <ReviewUpperWrapper>
          <Text>{REVIEWS_AND_RATINGS}</Text>
          {!showReview && (
            <PrimaryButton
              primaryText={WRITE_REVIEW}
              font={TypographyENUM.serif}
              componentSize={ComponentSizeENUM.medium}
              onBtnClick={() => setShowReview(true)}
              id="review-btn"
              theme={ThemeENUM.secondary}
            />
          )}
        </ReviewUpperWrapper>
        {productDetailData?.productRating !== 0 ? (
          <ReviewRatingWrapper>
            <AverageRatingsWrapper>
              <AverageRatingsTitle>
                {localeData?.AVERAGE_RATINGS || "Average Ratings"}
              </AverageRatingsTitle>
              <AverageRatingsNumber>
                {productDetailData?.productRating?.toFixed(2)}
                <Icons.Star fill="#007df3" />
              </AverageRatingsNumber>
              <AverageRatingsTotal>
                {localeData?.TOTAL || "Total"}
                <AverageNumber>
                  {productDetailData?.totalNoOfRatings || "0"}
                </AverageNumber>
                {localeData?.RATINGS || "Ratings"}
              </AverageRatingsTotal>
            </AverageRatingsWrapper>
            <ReviewPercentageWrapper>
              {productDetailData?.reviews?.reviewGraph?.map((item, idx) => (
                <div key={idx}>
                  <ReviewProgressBar
                    percentage={item.percentage}
                    stars={item.stars}
                  />
                </div>
              ))}
            </ReviewPercentageWrapper>
          </ReviewRatingWrapper>
        ) : (
          ""
        )}
        {showReview && (
          <ReviewFormContainer>
            <CrossWrapper>
              <Icons.Cross onClick={() => handleClose()} />
            </CrossWrapper>
            <PDPComponents.ReviewForm
              dataLocale={localeData}
              formValidation={formValidation}
              errorMessage={errorMessage}
              onSubmit={(data: any) => {
                setFormValues(data);
                onSubmit(data);
              }}
              id="review-form-accordion"
              font={TypographyENUM.defaultBook}
              apiFailMessage={reviewError}
              isRTL={false}
              reviewMessage={reviewMessage}
              reviewLoading={reviewLoading}
            />
          </ReviewFormContainer>
        )}
        {}
        <Divider />
        {rating !== undefined ? (
          <>
            {/* <ReviewMobile
              rating={rating}
              numOfRatings={count}
              font={TypographyENUM.sans}
            /> */}
            {reviewsToRender?.map((review) => (
              <div key={review.reviewId}>
                <ReviewCardWrapper>
                  <ReviewCardMobile
                    key={review.reviewId}
                    name={review.reviewee}
                    rating={review?.noOfStars}
                    isReadOnly={true}
                    maxRating={5}
                    componentSize={ComponentSizeENUM.small}
                    onStarsChange={() => null}
                    isRTL={false}
                    reviewTitle={review.reviewTitle}
                    reviewDetail={review?.reviewDetail}
                    font={TypographyENUM.sans}
                    primaryFont={TypographyENUM.lkSansBold}
                    secondaryFont={TypographyENUM.lkSansRegular}
                  />
                </ReviewCardWrapper>
                <Divider />
              </div>
            ))}
            {reviewsData.count >= 5 ? (
              <PaginationContainer>
                <Pagination
                  itemsPerPage={5}
                  totalOrderCount={reviewsData.count}
                  activePage={reviewsData.pageCount - 1}
                  setActivePage={(current: number) =>
                    handleOnPageClick(current)
                  }
                  clickOnPage={() => {}}
                />
              </PaginationContainer>
            ) : (
              ""
            )}
          </>
        ) : (
          <></>
        )}
      </ReviewContainer>
    </>
  );
};

export default ProductReviews;
