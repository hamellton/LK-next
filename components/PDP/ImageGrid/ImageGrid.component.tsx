//> Defaults
import { useEffect, useState } from "react";

//> Packages
import { PDP as PDPComponents, Modal, Icons } from "@lk/ui-library";
import { pdpFunctions } from "@lk/core-utils";

//> Types
import { ImageGridType } from "./ImageGrid.types";

//> Styles
import {
  CrossWrapper,
  ModalBody,
  SectionWrapper,
  View360IFrame,
  View360Image,
  View360Wrapper,
} from "./ImageGrid.styles";
import { URL_360 } from "@/constants/index";
import DittoTest from "./Ditto3DTryon";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getDittoProfileImage,
  setTryOnActive,
  setDittoAuth,
} from "@/redux/slices/ditto";
import { getCookie } from "@/helpers/defaultHeaders";
import { removeDomainName } from "helpers/utils";
import { ctaClickEvent } from "helpers/gaFour";

const ImageGrid = ({
  id,
  gridImages,
  configData,
  sessionId,
  dataLocale,
  altText,
}: ImageGridType) => {
  //> Local State
  const [imageGrid, setImageGrid] = useState<{
    showModal: boolean;
    selectedId: null | number;
  }>({ showModal: false, selectedId: null });
  const [show360Modal, setShow360Modal] = useState(false);
  const [is360Available, setIs360Available] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { productDetailData } = useSelector(
    (state: RootState) => state.productDetailInfo
  );

  const { testTryOn, isDittoAuthSet, dittoProfiles, dittoSignatures } =
    useSelector((state: RootState) => state.dittoInfo);
  const { reviewsLoading } = useSelector(
    (state: RootState) => state.productDetailInfo
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const { isRTL, country, subdirectoryPath } = useSelector(
    (state: RootState) => state.pageInfo
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (
      dittoProfiles.isdittoProfile &&
      testTryOn &&
      dittoProfiles?.dittoProfileData &&
      Object.keys(dittoSignatures).length <
        dittoProfiles.dittoProfileData.dittoId.length
    ) {
      // for (let i = 0; i < dittoProfiles.dittoProfileData.dittoId.length; i++) {
      // dispatch(
      //   setDittoAuth({
      //     sessionId: sessionId,
      //     dittoId: dittoProfiles.dittoProfileData.dittoId[i].id,
      //     set: true,
      //   })
      // );
      // }
    }
    if (!testTryOn) {
      setactive(false);
    }
  }, [dittoProfiles, testTryOn, dittoSignatures]);

  const [active, setactive] = useState(false);

  useEffect(() => {
    if (
      testTryOn &&
      isDittoAuthSet &&
      dittoProfiles?.dittoProfileData &&
      Object.keys(dittoSignatures).length ===
        dittoProfiles.dittoProfileData.dittoId.length &&
      !active
    ) {
      setactive(true);

      dispatch(
        getDittoProfileImage({
          dittoProfiles: dittoProfiles.dittoProfileData.dittoId,
          dittoSignatues: dittoSignatures || {},
        })
      );
    } else if (
      testTryOn &&
      isDittoAuthSet &&
      !active &&
      getCookie("isDittoID") != "lenskart"
    ) {
      const dittoID = (getCookie("isDittoID") || "").toString();
      dispatch(
        getDittoProfileImage({
          dittoProfiles: dittoID,
          dittoSignatues: dittoSignatures || {},
        })
      );
    }
  }, [dittoSignatures, active, testTryOn]);

  // useEffect(() => {
  //   if (getCookie("guestDitto")) {
  //     const dittoID = (getCookie("isDittoID") || "").toString();
  //     if (dittoID && !isDittoAuthSet && !reviewsLoading) {
  //       dispatch(
  //         setDittoAuth({
  //           sessionId: sessionId,
  //           dittoId: getCookie("guestDitto")?.toString() || "",
  //           set: true,
  //         })
  //       );
  //     }
  //     if (dittoID && isDittoAuthSet && !reviewsLoading) {
  //       dispatch(setTryOnActive(true));
  //     }
  //   }
  // }, [sessionId, dispatch, isDittoAuthSet, reviewsLoading]);

  //> Check if 360 View is available.
  useEffect(() => {
    checkFor360View(id);
  }, [id]);

  //> Show Image Grid Modal
  const gridImageClickHandler = (id: number) => {
    setImageGrid({ showModal: true, selectedId: id });
  };

  //> Show / Hide 360 View Modal
  const on360ClickHandler = () => {
    setShow360Modal(!show360Modal);
  };

  //> 360 View Check Handler
  const checkFor360View = async (id: string) => {
    const res = await pdpFunctions.get360ViewStatus(
      typeof id === "string" ? parseInt(id) : id
    );
    if (!res.error.isError) {
      setIs360Available(res.result.android_active);
    }
  };

  useEffect(() => {
    if (productDetailData) {
      const viewedProduct = {
        productUrl: `${subdirectoryPath}${removeDomainName(
          productDetailData.productURL || "",
          "",
          "",
          subdirectoryPath
        )}`,
        prices: productDetailData.price,
        brandName: productDetailData.brandName,
        id: productDetailData.id,
        imageUrl: productDetailData?.imageUrlDetail?.[0]?.imageUrl,
      };
      const recentViewProducts = localStorage.getItem(
        `recentViewProducts_${country}`
      )
        ? JSON.parse(
            localStorage.getItem(`recentViewProducts_${country}`) || ""
          )
        : [];

      if (recentViewProducts.length >= 8) {
        recentViewProducts.pop();
      }
      const matchIndex = recentViewProducts?.findIndex(
        (obj: any) => obj.id === productDetailData.id
      );
      if (matchIndex !== -1) {
        recentViewProducts.splice(matchIndex, 1);
      }
      const copyJsonData = recentViewProducts.concat(viewedProduct);
      localStorage.setItem(
        `recentViewProducts_${country}`,
        JSON.stringify(copyJsonData)
      );
      // console.log(
      //   recentViewProducts,
      //   localStorage.getItem(`recentViewProducts_${country}`)
      // );

      setRecentlyViewed(recentViewProducts);
    }
  }, [productDetailData]);

  const { ImagesGrid, RecentlyViewed, ImageModal } = PDPComponents;

  return (
    <>
      <SectionWrapper>
        {/** //> Image Grid Section */}
        <ImagesGrid
          altText={altText}
          imagesList={gridImages}
          onClick={gridImageClickHandler}
        />

        {/** //> 360 View Section */}
        {is360Available ? (
          <View360Wrapper
            onClick={() => {
              on360ClickHandler();
              const eventName = "cta_click";
              const cta_name = "view-360";
              const cta_flow_and_page = "product-detail-page";
              ctaClickEvent(
                eventName,
                cta_name,
                cta_flow_and_page,
                userInfo,
                pageInfo
              );
            }}
          >
            <View360Image alt={"view#360"} src={configData.IMAGE_360_VIEW} />
          </View360Wrapper>
        ) : null}
        {recentlyViewed.length ? (
          <RecentlyViewed
            dataLocale={dataLocale}
            productList={recentlyViewed}
            isRTL={isRTL}
          />
        ) : null}
      </SectionWrapper>

      <Modal
        onHide={() => null}
        show={testTryOn}
        bsSize={"lg"}
        keyboard
        dialogCss={`width: 40vw;  .modal-content{height: auto}`}
      >
        <Modal.Body height={"auto"}>
          <div>
            <DittoTest id={id} sessionId={sessionId} />
          </div>
        </Modal.Body>
      </Modal>

      {/** //> Image Grid Modal */}
      <Modal
        onHide={() => null}
        show={imageGrid.showModal}
        bsSize={"lg"}
        keyboard
        dialogCss={`width: 70vw;`}
      >
        <Modal.Body className={"fullheight fitimage"}>
          <div>
            <CrossWrapper
              onClick={() => setImageGrid({ ...imageGrid, showModal: false })}
            >
              <Icons.Cross
                onClick={() => setImageGrid({ ...imageGrid, showModal: false })}
              />
            </CrossWrapper>
            <ImageModal
              productList={gridImages}
              isSelectedImageID={imageGrid.selectedId}
              onClick={(id: number) => gridImageClickHandler(id)}
              isRTL={isRTL}
            />
          </div>
        </Modal.Body>
      </Modal>

      {/** //> 360 View Modal */}
      <Modal
        show={show360Modal}
        onHide={on360ClickHandler}
        bsSize={"lg"}
        keyboard={show360Modal}
        dialogCss={`width: 100%;margin-top:0px;margin-bottom:0px;`}
        id="modal360-view"
      >
        <ModalBody>
          <div>
            <CrossWrapper>
              <Icons.Cross onClick={() => on360ClickHandler()} />
            </CrossWrapper>
          </div>
          <View360IFrame
            src={`${URL_360}?sku=${id}`}
            title={configData.THREE_SIXTY_VIEW}
            width="100%"
            height="100%"
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default ImageGrid;
