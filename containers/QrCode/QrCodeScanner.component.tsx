import { Icons } from "@lk/ui-library";
import moduleName from "module";
import HtmlQrCode from "./Html5QrCode";
import { QrCloseButton, QrModel } from "./QrCodeScanner.styles";
import { QrScannerTypes } from "./QrCodeScanner.types";
import { useEffect } from "react";

const QrCodeScanner = ({
  showSearch,
  onClose,
  sessionId,
  localeData,
}: QrScannerTypes) => {
  // console.log(onQrClick);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <QrModel>
      <QrCloseButton onClick={onClose}>
        <Icons.Cross />
      </QrCloseButton>
      <div>
        <HtmlQrCode
          sessionId={sessionId}
          history={history}
          showSearch={showSearch}
          localeData={localeData}
          onClose={onClose}
        />
      </div>
    </QrModel>
  );
};

export default QrCodeScanner;
