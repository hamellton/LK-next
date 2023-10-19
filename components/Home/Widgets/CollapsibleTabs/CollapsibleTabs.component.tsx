import { FooterAccordion } from "@lk/ui-library";
import { TypographyENUM } from "@/types/baseTypes";
import { FooterAccordionWrapper } from "./CollapsibleTabs.styles";
import { CollapsibleTabsType } from "./CollapsibleTabs.types";

const CollapsibleTabs = ({ tabsData, customCSS }: CollapsibleTabsType) => {
  return (
    <FooterAccordionWrapper>
      {tabsData &&
        tabsData.map((tab: any, idx) => {
          return (
            <FooterAccordion
              key={`footerAccordion_${idx}`}
              label={tab.label}
              html={tab.html}
              font={TypographyENUM.defaultBook}
              id="footer"
              canCollapse={true}
              showBorderTop={false}
              isMaxHeight={false}
              isComponent={false}
              isRTL={false}
              width={Math.floor(100 / tabsData.length)}
              customCSS={customCSS}
            />
          );
        })}
    </FooterAccordionWrapper>
  );
};

export default CollapsibleTabs;
