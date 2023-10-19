import { CategoryParams, defaultCategoryParams } from "@/types/categoryTypes";
import { DEFAULT_PAGE_COUNT, DEFAULT_PAGE_SIZE } from "../constants";
import { ParsedUrlQuery } from "node:querystring";

//NOTE: Internal Function, don't export
const getPageCount = (pageCount: string | string[] | undefined) : number => {
    return pageCount ? parseInt(pageCount as string) : DEFAULT_PAGE_COUNT;
}



export const getDefaultParams = (pageCount: string | string[] | undefined): defaultCategoryParams => {
    const pageCountValue = getPageCount(pageCount);
    return {
        pageCount: pageCountValue,
        pageSize: pageCountValue > 0 ? (pageCountValue + 1) * 15 : DEFAULT_PAGE_SIZE,
    }
}

export const getParams = (query: ParsedUrlQuery): CategoryParams[] => {
    const params: CategoryParams[] = [];
    Object.keys(query).map((key) => {
        if (
            key !== "redisId" &&
            key !== "pageCount" &&
            key !== "pageSize" &&
            key !== "dir" &&
            key !== "gan_data" &&
            key !== "sort"
        ) {
            if (query[key]) {
            params.push({
                key: "filter_" + key,
                value:
                typeof query[key] === "string"
                    ? (query[key] as string)?.split(",")
                    : Array.isArray(query[key])
                    ? ((query[key]?.toString() || "") as string)?.split(",")
                    : [],
            });
            }
        }
    });
    
    if (query["sort"]) {
        params.push(
            { key: "dir", value: ["desc"] },
            { key: "gan_data", value: ["true"] },
            { key: "sort", value: [query["sort"].toString()] }
        );
    }

    return params;
}