export const processCarouselData = (data: any) => {
  if (typeof document !== "undefined") {
    let finalResult: any = [];

    data.map((item: any, index: number) => {
      function createElementFromHTML(htmlString: any) {
        var div = document.createElement("div");
        div.innerHTML = htmlString.trim();
        const firstChild = div.firstChild as HTMLElement;
        return {
          source: (
            firstChild.getElementsByClassName("mySlides")[0] as HTMLImageElement
          )?.src,
          altText: "",
          redirectUrl: (firstChild as HTMLAnchorElement).href,

          creativeName: (firstChild as HTMLAnchorElement)?.getAttribute(
            "data-creative-name"
          ),
          promotionId: (firstChild as HTMLAnchorElement)?.getAttribute(
            "data-promotion-id"
          ),
          promotionName: (firstChild as HTMLAnchorElement)?.getAttribute(
            "data-promotion-name"
          ),
          itemlistId: (firstChild as HTMLAnchorElement)?.getAttribute(
            "data-itemlist-id"
          ),
          itemlistName: (firstChild as HTMLAnchorElement)?.getAttribute(
            "data-itemlist-name"
          ),
        };
      }
      finalResult.push(createElementFromHTML(item.html));
    });
    return finalResult;
  }
};
