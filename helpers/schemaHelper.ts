import { BreadCrumbType, CategoryData } from "@/types/categoryTypes";
import { DataType } from "@/types/coreTypes";
import { GridImageType, ProductTypeBasic } from "@/types/productDetails";
import { convertHttps } from "containers/ProductDetail/helper";

export const getAppSchema = (domain: string, SCHEMA_APP: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: `${domain}`,
    name: SCHEMA_APP?.name || "Lenskart.com",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SCHEMA_APP?.contactPoint?.telephone || "+91-99998-99998",
      contactType: SCHEMA_APP?.contactPoint?.contactType || "Customer Service",
    },
    sameAs: SCHEMA_APP?.sameAs || [],
    logo:
      SCHEMA_APP?.logo ||
      "https://static.lenskart.com/media/mobile/images/lenskart_icon_512X512.png",
  };
};

export const getHomeSchema = (domain: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: `${domain}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${domain}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
};

export const getCategorySchema = (
  productData: ProductTypeBasic[],
  domain: string,
  description: string,
  name: string,
  url: string,
  categoryName: string
) => {
  const listSchema =
    (productData &&
      productData.map((item, index) => {
        return {
          "@type": "Product",
          url: `${domain}${item.productURL}`,
          name: `${item.productName} ${item?.productModelName ?? ""}`,
          image: item.productImage?.url,
          offers: {
            "@type": "Offer",
            price: item?.price?.lkPrice,
            priceCurrency: item?.price?.currency,
          },
        };
      })) ||
    [];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#CollectionPage`,
    mainEntity: { "@type": "ItemList", itemListElement: listSchema },
    description:
      description || `Buy ${categoryName} Online at Low Prices in India`,
    name: name,
    url: url,
    isPartOf: domain,
  };
};

export const getProductSchema = (
  brandName: string,
  productModelName: string | undefined,
  images: GridImageType[],
  seoDescription: string,
  id: number,
  sku: string | undefined,
  configData: DataType,
  color: string,
  size: string,
  material: any
) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `${brandName} ${productModelName}`,
    image:
      images.map((obj) => convertHttps(obj.imageUrl ? obj?.imageUrl : "")) ||
      configData?.PRODUCT_HELMET_DATA?.image,
    description: seoDescription || configData?.PRODUCT_HELMET_DATA?.description,
    color: color,
    size: size,
    material:
      material.find((obj: any) => obj?.name === "Material") &&
      material.find((obj: any) => obj?.name === "Material")?.value,

    mpn: id?.toString?.() || configData?.PRODUCT_HELMET_DATA?.mpn?.toString?.(),
    sku: sku || configData?.PRODUCT_HELMET_DATA?.sku,
    brand: {
      "@type": "Brand",
      name: brandName.toLowerCase().includes("lenskart")
        ? "Lenskart"
        : brandName || configData?.PRODUCT_HELMET_DATA?.brandName,
    },
    model: productModelName,
    itemCondition: "https://schema.org/NewCondition",
  };
};

export const getRatingSchema = (
  ratingValue: number | undefined,
  ratingCount: number | undefined,
  configData: DataType
) => {
  if (ratingCount && ratingCount > 0) {
    return {
      "@type": "AggregateRating",
      ratingValue: ratingValue?.toFixed(1),
      reviewCount: ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  } else {
    return configData?.PRODUCT_HELMET_DATA?.aggregateRating;
  }
};

export const getOffersSchema = (
  currencyCode: string,
  price: number,
  qty: number | undefined,
  url: string,
  configData: DataType
) => {
  return {
    "@type": "Offer",
    priceCurrency: `${currencyCode}`,
    price: `${price}`,
    itemCondition: "https://schema.org/NewCondition",
    availability:
      qty && qty > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    url: url || configData?.PRODUCT_HELMET_DATA?.url,
  };
};

export const getBreadcrumbSchema = (
  breadCrumbs: BreadCrumbType[],
  domain: string
) => {
  const schemaList =
    (breadCrumbs &&
      breadCrumbs.length &&
      breadCrumbs.map((item, index) => {
        if (!item.link) return null;
        return item.link && item.label !== "Mobile"
          ? {
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@id":
                  index == 0
                    ? `${domain}`
                    : `${domain}/${String(item.link).replace("mobile/", "")}`,
                name: item.label,
              },
            }
          : null;
      })) ||
    [];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaList,
  };
};

export const getReviewSchema = (reviews: any, configData: DataType) => {
  const reviewSchema =
    (reviews.length &&
      reviews.map((item: any) => {
        return {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: item?.userName,
          },
          datePublished: item.date
            ? decodeURIComponent(item?.date).split(" ")[0]
            : null,
          reviewBody: item?.desc ?? "",
          reviewRating: {
            "@type": "Rating",
            ratingValue: item?.rating,
          },
        };
      })) ||
    configData?.PRODUCT_HELMET_DATA?.review;

  return reviewSchema;
};
