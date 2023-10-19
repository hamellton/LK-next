import styled from "styled-components";

export const OrderDetailContainer = styled.div`
.my-account {
    .order-detail {
        .cta-btns {
            position: inherit;
            box-shadow: 0px -1px 4px rgba(0, 0, 0, 0.154184);
            border-top:none;
            &.pos-fix {
                position: fixed;
            }
        }
    }
}
.order-detail {
    .detail-wrapper {
        box-shadow: 0px 0.5px 1.5px rgba(0, 0, 0, 0.25);
    }
    .order-not-found {
        height: 100vh;
    }
}
.edit-address {
    background-color: #fafbfc;
    float: right;
    padding-right: 15px;
    padding-top: 26px;
    font-size: 14px;
    color: #00BAC6;
}

@media screen and (max-width: 359px) {
    .total { font-size: 18px;}
    .view-breakup { font-size: 12px;}
    .gst-text { font-size: 12px;}
    .tracking-details {
        .tracking-item { padding-left: 20px;}
    }
}
`