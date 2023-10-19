
export const triggerFBQEvent = (cartData: any, event: string) => {
    const fbqProdArr: number[] = [];
    let fbqCategory = "";
    let cartTotal;
    if (Array.isArray(cartData.cartTotal) && cartData.cartTotal) {
        cartData.cartTotal.forEach((cartAmount: any) => {
            if (cartAmount.type === "total") {
                cartTotal = cartAmount.amount;
            }
        })
    }
    if (Array.isArray(cartData.cartItems) && cartData?.cartItems.length) {
        cartData.cartItems.forEach((itemDetails: any) => {
            fbqProdArr.push(itemDetails.itemId);
            const itemClassification = itemDetails.itemClassification;
            if (itemClassification === "eyeframe") {
                fbqCategory = "Eyeglasses";
            } else if (itemClassification === '' && ["Eyeglasses"]?.indexOf(fbqCategory) === -1) {
                fbqCategory = "Sunglasses";
            } else if (
                itemClassification === "contact_lens" &&
                ["Eyeglasses", "Sunglasses"]?.indexOf(fbqCategory) === -1
            ) {
                fbqCategory = "Contact Lens";
            } else if (["Eyeglasses", "Sunglasses", "Contact Lens"]?.indexOf(fbqCategory) === -1) {
                fbqCategory = "Accessories";
            }
        })
    }
    if (typeof window?.fbq !== 'undefined') {
        window?.fbq('track', event, {
            content_category: fbqCategory,
            content_ids: fbqProdArr,
            content_type: 'product',
            value: cartTotal,
            num_items: cartData.cartCount,
            currency: cartData.currencyCode
        });
    }
}