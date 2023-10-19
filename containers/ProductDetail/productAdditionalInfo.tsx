/* eslint-disable react-hooks/rules-of-hooks */
import {
  TypographyENUM,
  ComponentSizeENUM,
  ThemeENUM,
} from "@/types/baseTypes";
import { ProductDetailType } from "@/types/productDetails";
import { Modal, PDP as PDPComponents, PrimaryButton } from "@lk/ui-library";
import { ReviewButtonWrapper } from "./ProductDetail.styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  dispatchFetchMoreReviews,
  dispatchPinCodeData,
  dispatchPostReview,
  resetReviewData,
} from "@/redux/slices/productDetailInfo";
import { ButtonContainer } from "@/components/PDP/TechnicalInfo/TechnicalInfo.styles";
import { CloseButton } from "@/components/Details/CustomModalStyles";
import TechnicalInfoWrapper from "@/components/PDP/TechnicalInfo/TechnicalInfo.component";
import { LocaleDataType, LocalType } from "@/types/coreTypes";
import { Icons } from "@lk/ui-library";
import { removeDomainName } from "helpers/utils";
// import { isRTL } from "pageStyles/constants";

const SingleReview = (
  productDetailData: ProductDetailType,
  localeData: LocaleDataType
) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    reviewsData,
    reviewsLoading,
    reviewMessage,
    reviewLoading,
    reviewError,
  } = useSelector((state: RootState) => state.productDetailInfo);
  const sessionId = useSelector((state: RootState) => state.userInfo.sessionId);
  const isRTL = useSelector((state: RootState) => state.pageInfo.isRTL);

  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>({
    email: "",
    reviewDetail: "",
    name: "",
    title: "",
    noOfStars: "",
  });
  const [onSubmitForm, setOnSubmitForm] = useState(false);
  const [formValues, setFormValues] = useState({});
  const listInnerRef = useRef();

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (
        scrollTop + clientHeight > scrollHeight - 100 &&
        !reviewsLoading &&
        reviewsData?.reviews &&
        reviewsData?.reviews?.length < reviewsData?.count
      ) {
        dispatch(
          dispatchFetchMoreReviews({
            pid: productDetailData.id,
            pageSize: 10,
            nextPage: ((reviewsData?.pageCount || 0) + 1).toString(),
            sessionId: sessionId,
          })
        );
      }
    }
  };

  const errorsMsg = {
    THIS_FIELD_IS_REQUIRED: "This Field is Required",
    INVALID_MAIL: "Please enter a valid Email",
    INVALID_LENGTH: "Must be at least 6 characters",
  };

  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const errors = (val: string, type: string) => {
    if (
      !val ||
      (typeof val === "number" && val === 0) ||
      (typeof val === "string" && val.trim().length === 0)
    ) {
      return errorsMsg.THIS_FIELD_IS_REQUIRED;
    }
    if (type === "name") {
    } else if (type === "emailData") {
      if (!val.match(mailformat)) {
        return errorsMsg.INVALID_MAIL;
      }
    } else if (type === "review") {
      if (val.length < 6) {
        return errorsMsg.INVALID_LENGTH;
      }
    } else if (type === "noOfStars") {
      if (!val || (typeof val === "string" && parseInt(val) === 0)) {
        return "Please provide us rating";
      }
    }
    return "";
  };

  const formValidation = (val: any) => {
    const type = Object.keys(val)[0];

    if (type === "name") {
      const nameError = errors(val.name, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, name: nameError };
      });
    }
    if (type === "emailData") {
      const emailError = errors(val.emailData, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, email: emailError };
      });
    }
    if (type === "title") {
      const titleError = errors(val.title, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, title: titleError };
      });
    }
    if (type === "review") {
      const reviewError = errors(val.review, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, reviewDetail: reviewError };
      });
    }
    if (type === "noOfStars") {
      const noOfStarsError = errors(val.noOfStars, type);
      setErrorMessage((prevBody: any) => {
        return { ...prevBody, noOfStars: noOfStarsError };
      });
    }
  };

  const onSubmit = (formData: any) => {
    formValidation({ emailData: formData.email });
    formValidation({
      review: formData.review.reviewDetail,
    });
    formValidation({
      title: formData.review.reviewTitle,
    });
    formValidation({
      name: formData.review.reviewee,
    });
    formValidation({
      noOfStars: formData.review.noOfStars,
    });

    setOnSubmitForm(true);
  };

  const submitForm = (formData: any) => {
    dispatch(
      dispatchPostReview({
        pid: productDetailData.id,
        email: formData.email,
        review: formData.review,
        sessionId,
      })
    );
  };

  useEffect(() => {
    if (
      onSubmitForm &&
      !errorMessage.name &&
      !errorMessage.title &&
      !errorMessage.email &&
      !errorMessage.reviewDetail &&
      !errorMessage.noOfStars
    ) {
      submitForm(formValues);
    }
    setOnSubmitForm(false);
  }, [onSubmitForm]);

  const onClose = () => {
    setShowAddReview(false);
    setErrorMessage({
      email: "",
      reviewDetail: "",
      name: "",
      title: "",
      noOfStars: "",
    });
    setTimeout(() => {
      dispatch(resetReviewData());
    }, 1000);
  };

  useEffect(() => {
    // let timeout;
    if (reviewMessage) {
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }, [reviewMessage]);

  return (
    <>
      <Modal show={showMoreReviews} onHide={() => setShowMoreReviews(false)}>
        <ButtonContainer>
          <CloseButton onClick={() => setShowMoreReviews(false)}>
            <Icons.Cross />
          </CloseButton>
        </ButtonContainer>

        <PDPComponents.ReviewDetails
          id="review-details-pdp"
          maxHeight="750px"
          productBrand={productDetailData.brandName}
          productName={productDetailData.productName}
          numberOfReviews={reviewsData?.count}
          avgRating={reviewsData?.rating || 0}
          dataLocale={localeData}
          font={TypographyENUM.defaultBook}
          onScroll={onScroll}
          reviewsLoading={reviewsLoading}
          listInnerRef={listInnerRef}
          writeReviewHandler={() => {
            setShowMoreReviews(false);
            setShowAddReview(true);
          }}
        >
          {reviewsData?.reviews?.map((rv) => (
            <PDPComponents.ReviewCard isRTL={isRTL} key={rv.reviewId} {...rv} />
          ))}
        </PDPComponents.ReviewDetails>
      </Modal>

      <Modal
        show={showAddReview}
        onHide={() => {
          setShowAddReview(false);
        }}
      >
        <ButtonContainer>
          <CloseButton
            onClick={() => {
              onClose();
            }}
          >
            <Icons.Cross />
          </CloseButton>
        </ButtonContainer>
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
          isRTL={isRTL}
          reviewMessage={reviewMessage}
          reviewLoading={reviewLoading}
        />
      </Modal>

      {reviewsData?.reviews && reviewsData.reviews.length > 0 && (
        <PDPComponents.ReviewCard isRTL={isRTL} {...reviewsData.reviews[0]} />
      )}

      <ReviewButtonWrapper isRowWise={reviewsData?.reviews?.length !== 0}>
        <PrimaryButton
          id="1234"
          height="45px"
          width={reviewsData?.reviews?.length ? "47%" : "100%"}
          primaryText={
            reviewsData?.reviews?.length
              ? localeData.MORE_REVIEWS
              : localeData.NO_REVIEWS
          }
          theme={ThemeENUM.secondary}
          onBtnClick={() => {
            reviewsData?.reviews?.length ? setShowMoreReviews(true) : null;
          }}
          font={TypographyENUM.defaultBook}
          componentSize={ComponentSizeENUM.medium}
          borderColor={
            reviewsData?.reviews?.length ? "var(--turquoise)" : "transparent"
          }
          color={reviewsData?.reviews?.length ? "var(--turquoise)" : "#333"}
          backgroundColor="transparent"
        />
        <PrimaryButton
          id="3456"
          height="45px"
          width={reviewsData?.reviews?.length ? "47%" : "100%"}
          primaryText={localeData.WRITE_REVIEW}
          theme={ThemeENUM.primary}
          onBtnClick={() => setShowAddReview(true)}
          font={TypographyENUM.defaultBook}
          componentSize={ComponentSizeENUM.medium}
        />
      </ReviewButtonWrapper>
    </>
  );
};

const renderDeliveryOpt = (pid: number) => {
  const dispatchPinCode = useDispatch<AppDispatch>();

  const sessionId = useSelector((state: RootState) => state.userInfo.sessionId);
  const { pinCodeData, pinCodeLoading, pinCodeError, pinCodeErrorMessage } =
    useSelector((state: RootState) => state.productDetailInfo);

  return (
    <PDPComponents.CheckDeliveryOption
      id="test"
      isRTL={false}
      isLoading={pinCodeLoading}
      onSearch={(number: number) =>
        dispatchPinCode(
          dispatchPinCodeData({
            pid: pid,
            pinCode: number,
            countryCode: "in",
            sessionId,
          })
        )
      }
      pinCode={(pinCodeData?.pinCode || "").toString()}
      isError={pinCodeError}
      errorMessage={pinCodeErrorMessage}
      deliveryDate={pinCodeData.detailData?.deliveryDate}
      deliveryOption={pinCodeData.detailData?.deliveryOption}
      showEstimateDelivery={
        !pinCodeLoading && pinCodeData.detailData && !pinCodeError
          ? true
          : false
      }
    />
  );
};

const getProductAdditionalInfo = (
  productDetailData: ProductDetailType,
  localeConfig: LocaleDataType,
  pageInfo: any,
  isDesktopNearby?: boolean,
  isDesktopDelivery?: boolean
) => {
  const { reviewsData } = useSelector(
    (state: RootState) => state.productDetailInfo
  );

  let newTechnicalProductInfo = productDetailData.technicalProductInfo.map(
    (item) => {
      return {
        ...item,
        additionalInfoUrl: item?.additionalInfoUrl
          ? pageInfo.subdirectoryPath +
            removeDomainName(item?.additionalInfoUrl, "")
          : null,
      };
    }
  );

  const productArr = [
    {
      name: localeConfig.TECHNICAL_INFORMATION,
      id: "technicalID",
      type: "COMPONENT",
      component: () => (
        <TechnicalInfoWrapper
          id="technicalID"
          localeData={localeConfig}
          data={[
            ...newTechnicalProductInfo,
            ...productDetailData.generalProductInfo,
          ]}
          newGeneralProductInfo={productDetailData.generalProductInfo}
        />
      ),
      canCollapse: true,
      showBorderTop: false,
    },
    {
      name: `${localeConfig.REVIEW}(${productDetailData.reviews.count || 0})`,
      id: "review",
      type: "COMPONENT",
      component: () => SingleReview(productDetailData, localeConfig),
      canCollapse: true,
      showBorderTop: true,
    },
  ];

  if (isDesktopDelivery) {
    productArr.splice(1, 0, {
      name: localeConfig.CHECK_DELIVERY_OPT,
      id: "deliveryOpt",
      type: "COMPONENT",
      component: () => renderDeliveryOpt(productDetailData.id),
      canCollapse: true,
      showBorderTop: true,
    });
  }

  if (isDesktopNearby) {
    productArr.splice(1, 0, {
      name: localeConfig.VISIT_NEAR_BY,
      id: "storeNearBy",
      type: "COMPONENT",
      component: () => (
        <PDPComponents.NearStore
          id="store-locator"
          isRTL={false}
          onClickStoreLocator={"https://stores.lenskart.com/"}
        />
      ),
      canCollapse: true,
      showBorderTop: true,
    });
  }
  return productArr;
};

export default getProductAdditionalInfo;
