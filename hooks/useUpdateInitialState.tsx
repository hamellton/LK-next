import { fetchCarts, updateCartCount } from "@/redux/slices/cartInfo";
import {
  updateCategoryState,
  updateDefaultParams,
} from "@/redux/slices/categoryInfo";
import {
  updateDeviceType,
  updateIsRTL,
  updatePageId,
  updatePageLoaded,
  updatePageNumber,
  updatePageSize,
  updatePageType,
} from "@/redux/slices/pageInfo";
import {
  updateProductDetailData,
  updateProductDetailLoading,
  updateReviewsData,
  updateReviewsLoading,
  dispatchFetchMoreReviews,
} from "@/redux/slices/productDetailInfo";
import { fetchUserDetails, updateUserData } from "@/redux/slices/userInfo";
import { fetchWishlist, updateWishListIds } from "@/redux/slices/wishListInfo";
import { AppDispatch, RootState } from "@/redux/store";
import { DeviceTypes, PageTypes } from "@/types/baseTypes";
import { CategoryData } from "@/types/categoryTypes";
import { ProductDetailType, ProductTypeBasic } from "@/types/productDetails";
import { setCookie } from "@/helpers/defaultHeaders";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface useUpdateInitialStateType {
  pageCount: number;
  pageSize: number;
  pageType: PageTypes;
  id: number;
  categoryData: CategoryData;
  productListData: ProductTypeBasic[];
  productDetailData: ProductDetailType;
}

const useUpdateInitialState = ({
  pageCount,
  id,
  categoryData,
  productListData,
  pageSize,
  pageType,
  productDetailData,
}: useUpdateInitialStateType) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // console.log(router.query);
  const { lang } = router.query;
  // console.log(lang);

  const { isRenderedOnce } = useSelector(
    (state: RootState) => state.categoryInfo
  );

  const { sessionId } = useSelector((state: RootState) => state.userInfo);

  useEffect(() => {
    if (!isRenderedOnce) {
      dispatch(
        updateCategoryState({
          isDittoEnabled: false,
          filterSelected: {},
          filterDeleted: false,
          categoryData: categoryData,
          productList: productListData,
          filters: null,
          categoryDataLoading: false,
          productListLoading: false,
          filtersLoading: false,
          isRenderedOnce: true,
          defaultParams: {
            pageCount: 1,
            pageSize: 15,
          },
          otherParams: {},
          filterMapping: {},
        })
      );
    }

    const device =
      process.env.NEXT_PUBLIC_APP_CLIENT === "mobilesite"
        ? DeviceTypes.MOBILE
        : DeviceTypes.DESKTOP;

    dispatch(updateDeviceType(device));
    dispatch(updatePageSize(pageSize));
    dispatch(updatePageNumber(pageCount));
    if (id) dispatch(updatePageId(id));
    dispatch(updatePageLoaded(true));

    dispatch(
      updateDefaultParams({
        pageCount: pageCount ?? 0,
        pageSize: pageSize ?? 15,
      })
    );
    dispatch(updatePageType(pageType as PageTypes));
    dispatch(
      updateIsRTL(process.env.NEXT_PUBLIC_DIRECTION === "RTL" ? true : false)
    );

    dispatch(updateProductDetailData(productDetailData));
    dispatch(updateProductDetailLoading(false));

    dispatch(updateReviewsLoading(false));
    if (sessionId && productDetailData?.id) {
      dispatch(
        dispatchFetchMoreReviews({
          pid: productDetailData.id,
          pageSize:
            process.env.NEXT_PUBLIC_APP_CLIENT === "mobilesite" ? 5 : 10,
          nextPage: "1",
          sessionId: sessionId,
        })
      );
    }
  }, [
    categoryData,
    dispatch,
    id,
    isRenderedOnce,
    pageCount,
    pageSize,
    pageType,
    productDetailData,
    productListData,
    sessionId,
  ]);
};

export default useUpdateInitialState;
