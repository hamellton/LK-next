import { RootState } from "@/redux/store";
import { NewPriceBreakup } from "@lk/ui-library";
import { BottomSheet } from "@lk/ui-library";
import { getCurrency } from "helpers/utils";
import React from "react";
import { useSelector } from "react-redux";
import { OrderDetailContainer } from "./OrderDetail.styles";

const OrderDetailComp = ({ localeData }: any) => {
  const pageInfo = useSelector((state: RootState) => state.pageInfo);
  const cartData = useSelector((state: RootState) => state.cartInfo);
  return (
    <OrderDetailContainer>
      <div className="order-detail bg-pale_grey">
        {/* {(Boolean(!selectedOrder || !items) && orderDetails && !orderDetails.error) ||
            (loading && <Spinner fullpage />)} */}
        {/* {orderDetails && (!orderDetails.result || orderDetails.error) && ( */}
        <div className="display-flex bg-color_white fw700 fsp14 align-items-center justify-content-center order-not-found">
          {/* {NO_RESULT} */}
          No Result
        </div>
        {/* )} */}
        {/* {Boolean(selectedOrder && items) && ( */}
        <React.Fragment>
          {/* <OrderDetailContext.Provider
                value={{ userInfo, returnConfig, orderStatusRedis: redisCommonData?.ORDER_STATUS }}
              > */}
          {/* <Order
                  email={userInfo.email}
                  history={history}
                  order={selectedOrder}
                  orderReturnable={returnable}
                  returnEligibiliyDetails={returnEligibiliyDetails}
                /> */}
          {/* </OrderDetailContext.Provider> */}
          {/* {orderDetails?.result?.flags?.canUpdateAddress && ( */}
          <div
            className="edit-address"
            //   onClick={() => {
            //     this.closeEditAddress();
            //     this.trackingDetail();
            //   }}
          >
            {/* {EDIT} */}
            Edit
          </div>
          {/* )} */}
          {/* {shippingAddress && !orderDetails?.result?.isDigitalCart && (
                <OrderAddress address={shippingAddress} dataLocale={dataLocale} />
              )} */}
          {/* <PriceBreakUp
                ref={this.priceRef}
                amount={amount}
                currencyMark={"Rs"}
                dataLocale={dataLocale}
              /> */}
          <NewPriceBreakup
            id="1"
            width="100"
            dataLocale={localeData}
            priceData={cartData?.cartTotal}
            showCart={false}
            currencyCode={getCurrency(pageInfo.country)}
          />
          {/* <FixedCTA> */}
          <div className="order-cta pd-l8 pd-r8 pd-t8 pd-b8 display-flex align-items-center justify-space-between">
            <span className="display-flex align-items-center">
              <span className="total fw700 fsp22 text-color_link_blue">
                {/* {<span>{currencyMark[amount.currencyCode]}</span>} {amount.total} */}
                Rs. 10
              </span>
              <span className="gst-text fsp14 text-color_grey_black mr-l8">
                {/* {TOTAL_INCLUDING_GST} */}
                Total including Gst
              </span>
            </span>
            <span
              className="view-breakup text-capitalize fsp14 text-color_link_blue"
              // onClick={this.gotoPriceBreakUp}
            >
              View Breakup
              {/* {VIEW_BREAKUP} */}
            </span>
          </div>
          {/* </FixedCTA> */}
        </React.Fragment>
        {/* )} */}
        {/* {isEditAddress && orderDetails?.result?.flags?.canUpdateAddress && ( */}
        <BottomSheet
          addressEditOrderDetail
          backdrop
          expanded
          //   backdropClassname={redisCommonData.MSITE_NEW_ADDRESS_DESIGN ? 'new' : ''}
          //   className={redisCommonData.MSITE_NEW_ADDRESS_DESIGN ? 'new' : ''}
          //   onClickBackdrop={this.closeEditAddress}
        >
          <div className="mr-t10">
            <span
              className="text-topaz fsp14 pd-10 cross"
              data-testid="closeUpdatePower"
              style={{ float: "right" }}
              //   onClick={this.closeEditAddress}
            >
              &#10005;
            </span>
          </div>
          <h2 className="border-bottom pd-l10 pd-r10 pd-t12 pd-b10 mr-b10">
            {/* {WHERE_WOULD_YOU_LIKE_US_TO_DELIVER}
                {QUESTION_MARK} */}
            Where would you like us to deliver?
          </h2>
          {/* <SavedAddresses
                addressEditOrderDetail
                fromOrderDetails
                cartData={orderDetails}
                className="new"
                editAddress={this.editAddress}
                saveShippingError={saveShippingError}
                submitAddress={this.submitAddress}
              ></SavedAddresses> */}
        </BottomSheet>
        {/* )} */}
        {/* <Modal
            modalData={this.props.studioFlowReducer?.modal ?? { open: false, data: {} }}
            setModalData={data => {
              this?.props?.studioFlowModalCall(data);
              window.location.reload();
            }}
          /> */}
      </div>
    </OrderDetailContainer>
  );
};

export default OrderDetailComp;
