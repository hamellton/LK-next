import { createGlobalStyle } from "styled-components";
import { styles } from "@lk/ui-library";

const GlobalStyles = createGlobalStyle<{ mobileView?: boolean }>`
    :root {
        ${styles.getRootStyles()}
    }
    html {
        ${styles.getHTMLStyles()}
        /* overflow-x:hidden; */
    }
    .text-topaz {
        color: #1cbbb4;
    }
    body {
        ${styles.getBaseStyles()}
        font-family: LKFuturaStd-Medium,Arial,sans-serif;
        font-size: 13px;
        line-height: 1.42857;
        color: #333;
        background-color: #fff;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-overflow-scrolling: touch;
        // pointer events none coming from postpay script (to override it)
        svg{
            pointer-events: auto !important;
        }
    }
    // body::-webkit-scrollbar,html::-webkit-scrollbar {
	// 	display: none;
	// 	width: 0;
	// 	height: 0;
	// }
    *, ::before,::after {
        ${styles.getBaseStyles()}
    }

    a {
        ${styles.getAnchorStyles()}
    }
    #maincontainerdesk {
        a {
            display: inherit;
        }
        img {
            vertical-align: middle;
        }
    }
    h1,h2,h3,h4,h5,h6 {
        ${styles.getHeadingStyles()}
    }

    section{
        // margin: 10px auto;
    }

    main {
        margin: 0 auto;
        min-width: 978px;
        max-width: 1920px;
        @media screen and (max-width: 1000px){
            min-width: 300px;
            max-width: 1000px;
        }

        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
    }
`;

const FontStyles = createGlobalStyle`
@font-face {
    font-family: 'LKSans-Bold';
    src: url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Bold.woff') format('woff'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Bold.otf') format('otf'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Bold.eot') format('eot'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Bold.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKSans-Medium';
    src: url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Medium.woff') format('woff'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Medium.otf') format('otf'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Medium.eot') format('eot'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Medium.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKSans-Regular';
    src: url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Regular.woff') format('woff'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Regular.otf') format('otf'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Regular.eot') format('eot'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Regular.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKSans-Black';
    src: url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Black.woff') format('woff'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Black.otf') format('otf'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Black.eot') format('eot'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Black.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKSans-Extrablack';
    src: url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Extrablack.woff') format('woff'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Extrablack.otf') format('otf'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Extrablack.eot') format('eot'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Extrablack.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKSans-Hairline';
    src: url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Hairline.woff') format('woff'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Hairline.otf') format('otf'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Hairline.eot') format('eot'), url('https://static.lenskart.com/fonts/fonts/ds/lksans/LenskartSans-Hairline.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKSerif-Normal';
    src: url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-Normal.woff') format('woff'), url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-Normal.otf') format('otf'), url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-Normal.eot') format('eot'), url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-Normal.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKSerif-Book';
    src: url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-Book.woff') format('woff'), url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-Book.otf') format('otf'), url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-Book.eot') format('eot'), url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-Book.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKSerif-UltraLight';
    src: url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-UltraLight.woff') format('woff'), url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-UltraLight.otf') format('otf'), url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-UltraLight.eot') format('eot'), url('https://static.lenskart.com/fonts/fonts/ds/lkserif/Lenskart-Serif-UltraLight.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKFuturaStd-Heavy';
    src: url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Heavy.woff') format('woff'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Heavy.otf') format('otf'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Heavy.eot') format('eot'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Heavy.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKFuturaStd-Medium';
    src: url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Medium.woff') format('woff'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Medium.otf') format('otf'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Medium.eot') format('eot'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Medium.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKFuturaStd-Book';
    src: url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Book.woff') format('woff'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Book.otf') format('otf'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Book.eot') format('eot'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Book.ttf') format('ttf');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'LKFuturaStd-Light';
    src: url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Light.woff') format('woff'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Light.ttf') format('truetype'), url('https://static.lenskart.com/media/wysiwyg/futura-fonts/FuturaStd-Light.svg') format('svg');
    font-display: swap;
    font-weight: normal;
    font-style: normal
}

@font-face {
    font-family: 'Rajdhani-Medium';
    src: url('https://static.lenskart.com/media/wysiwyg/futura-fonts/Rajdhani-Medium.ttf') format('truetype');
    font-display: swap;
    font-weight: 700;
    font-style: normal
}

@font-face {
    font-family: 'Rajdhani-Medium';
    src: url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Medium/Rajdhani-Medium.eot);
    src: url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Medium/Rajdhani-Medium.eot?#iefix) format('embedded-opentype'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Medium/Rajdhani-Medium.ttf) format('truetype'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Medium/Rajdhani-Medium.otf) format('otf'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Medium/Rajdhani-Medium.woff) format('woff'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Medium/Rajdhani-Medium.woff2) format('woff2');
  }
  @font-face {
    font-family: 'Rajdhani-Bold';
    src: url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Bold/Rajdhani-Bold.eot);
    src: url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Bold/Rajdhani-Bold.eot?#iefix) format('embedded-opentype'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Bold/Rajdhani-Bold.otf) format('otf'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Bold/Rajdhani-Bold.svg#Rajdhani-Bold) format('svg'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Bold/Rajdhani-Bold.ttf) format('truetype'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Bold/Rajdhani-Bold.woff) format('woff'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-Bold/Rajdhani-Bold.woff2) format('woff2');
  }

  @font-face {
    font-family: 'Rajdhani-SemiBold';
    src: url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-SemiBold/Rajdhani-SemiBold.eot);
    src: url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-SemiBold/Rajdhani-SemiBold.eot?#iefix) format('embedded-opentype'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-SemiBold/Rajdhani-SemiBold.otf) format('otf'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-SemiBold/Rajdhani-SemiBold.svg#Rajdhani-SemiBold) format('svg'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-SemiBold/Rajdhani-SemiBold.ttf) format('truetype'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-SemiBold/Rajdhani-SemiBold.woff) format('woff'),
         url(https://static.lenskart.com/media/desktop/fonts/DesignStudio/Rajdhani-SemiBold/Rajdhani-SemiBold.woff2) format('woff2');
  }

@font-face {
    font-family: 'Rajdhani-Regular';
    src: url('https://static.lenskart.com/media/wysiwyg/futura-fonts/Rajdhani-Regular.ttf') format('truetype');
    font-display: swap;
    font-weight: normal;
    font-style: normal
}
@font-face {
    font-family: 'Plus Jakarta Sans-Bold';
    src: url('https://static.lenskart.com/media/desktop/fonts/DesignStudio/PlusJakartaSans-Bold.ttf') format('truetype');
    font-display: swap;
    font-weight: normal;
    font-style: normal
}
@font-face {
    font-family: 'Plus Jakarta Sans';
    src: url('https://static.lenskart.com/media/desktop/fonts/DesignStudio/PlusJakartaSans-Regular.ttf') format('truetype');
    font-display: swap;
    font-weight: normal;
    font-style: normal
}
@font-face {
    font-family: 'Plus Jakarta Sans-Medium';
    src: url('https://static.lenskart.com/media/desktop/fonts/DesignStudio/PlusJakartaSans-Medium.ttf') format('truetype');
    font-display: swap;
    font-weight: normal;
    font-style: normal
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 100;
    font-display: swap;
    src: local('Roboto Thin'), local('Roboto-Thin'), local('sans-serif-thin'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOkCnqEu92Fr1MmgVxGIzIXKMnyrYk.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 100;
    font-display: swap;
    src: local('Roboto Thin'), local('Roboto-Thin'), local('sans-serif-thin'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOkCnqEu92Fr1MmgVxIIzIXKMny.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: local('Roboto Light'), local('Roboto-Light'), local('sans-serif-light'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOlCnqEu92Fr1MmSU5fChc4AMP6lbBP.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: local('Roboto Light'), local('Roboto-Light'), local('sans-serif-light'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Roboto'), local('Roboto-Regular'), local('sans-serif'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOmCnqEu92Fr1Mu7GxKKTU1Kvnz.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Roboto'), local('Roboto-Regular'), local('sans-serif'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: local('Roboto Medium'), local('Roboto-Medium'), local('sans-serif-medium'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOlCnqEu92Fr1MmEU9fChc4AMP6lbBP.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: local('Roboto Medium'), local('Roboto-Medium'), local('sans-serif-medium'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('Roboto Bold'), local('Roboto-Bold'), local('sans-serif'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOlCnqEu92Fr1MmWUlfChc4AMP6lbBP.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('Roboto Bold'), local('Roboto-Bold'), local('sans-serif'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 900;
    font-display: swap;
    src: local('Roboto Black'), local('Roboto-Black'), local('sans-serif-black'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOlCnqEu92Fr1MmYUtfCRc4AMP6lbBP.woff2) format('woff2');
    unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 900;
    font-display: swap;
    src: local('Roboto Black'), local('Roboto-Black'), local('sans-serif-black'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOlCnqEu92Fr1MmYUtfChc4AMP6lbBP.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 900;
    font-display: swap;
    src: local('Roboto Black'), local('Roboto-Black'), local('sans-serif-black'), url(https://static.lenskart.com/media/mobile/fonts/roboto/KFOlCnqEu92Fr1MmYUtfBBc4AMP6lQ.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}


@font-face {
    font-family: 'Roboto Slab';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: local('Roboto Slab Light'), local('RobotoSlab-Light'), url(https://static.lenskart.com/media/mobile/fonts/robotoslab/BngRUXZYTXPIvIBgJJSb6u9mxLCIwR2oefDofMY.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
    font-family: 'Roboto Slab';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: local('Roboto Slab Light'), local('RobotoSlab-Light'), url(https://static.lenskart.com/media/mobile/fonts/robotoslab/BngRUXZYTXPIvIBgJJSb6u9mxLCGwR2oefDo.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: 'Roboto Slab';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Roboto Slab Regular'), local('RobotoSlab-Regular'), url(https://static.lenskart.com/media/mobile/fonts/robotoslab/BngMUXZYTXPIvIBgJJSb6ufD5qWr4xCCQ_k.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
    font-family: 'Roboto Slab';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Roboto Slab Regular'), local('RobotoSlab-Regular'), url(https://static.lenskart.com/media/mobile/fonts/robotoslab/BngMUXZYTXPIvIBgJJSb6ufN5qWr4xCC.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: 'Roboto Slab';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('Roboto Slab Bold'), local('RobotoSlab-Bold'), url(https://static.lenskart.com/media/mobile/fonts/robotoslab/BngRUXZYTXPIvIBgJJSb6u92w7CIwR2oefDofMY.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
    font-family: 'Roboto Slab';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('Roboto Slab Bold'), local('RobotoSlab-Bold'), url(https://static.lenskart.com/media/mobile/fonts/robotoslab/BngRUXZYTXPIvIBgJJSb6u92w7CGwR2oefDo.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

`;

export { GlobalStyles, FontStyles };
