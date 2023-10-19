import { Icons } from "@lk/ui-library";
import { setCookie } from "@/helpers/defaultHeaders";
import React from "react";
import { exchange_classic_eyeglasses } from "../exchange_classic_eyeglasses";
import { CollectionBody, CollectionHeader, CollectionWrapper, Container, Heading, Outer, TopHead } from "./CollectionPage.styles";
import { CollectionPageType } from "./CollectionPage.type";



const CollectionPage = ({closeSidebar, configData}: CollectionPageType) => {
  return (
    <CollectionWrapper>
      <CollectionHeader>
        <TopHead>{configData.CHOOSE_FRAME_STYLE}</TopHead>
        <Icons.Cross onClick={() => closeSidebar()} />
      </CollectionHeader>
      <CollectionBody>
        <Heading>{exchange_classic_eyeglasses.result[0].title}</Heading>
        {exchange_classic_eyeglasses.result.map((response: any, i: number) => {
          return (
            <Container key={i}>
              {response.items.map((item: any, i: number) => {
                return (
                  <Outer key={i}>
                    <a
                      href={item.url}
                      onClick={() => setCookie("postcheckExchangeNP", true)}
                    >
                      <img alt="img" src={item.img} />
                    </a>
                  </Outer>
                );
              })}
            </Container>
          );
        })}
      </CollectionBody>
    </CollectionWrapper>
  );
};

export default CollectionPage;
