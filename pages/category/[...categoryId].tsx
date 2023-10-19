import { APIMethods } from "@/types/apiTypes";
import { defaultCategoryParams } from "@/types/categoryTypes";
import { categoryFunctions, sessionFunctions } from "@lk/core-utils";
import { APIService } from "@lk/utils";
import { getCookie, hasCookie, setCookie } from "@/helpers/defaultHeaders";
import { headerArr } from "helpers/defaultHeaders";
import { GetServerSideProps } from "next";

const CategoryRedirect = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const { categoryId } = context.query;
  const api = new APIService(`${process.env.NEXT_PUBLIC_API_URL}`).setHeaders(
    headerArr
  );
  const country = process.env.NEXT_PUBLIC_APP_COUNTRY?.toLowerCase();
  const isSessionAvailable = hasCookie(`clientV1_${country}`, { req, res });

  //> If session is not available, create a new session and set in cookie.
  if (!isSessionAvailable) {
    api.setMethod(APIMethods.POST);
    const { data: sessionId, error } = await sessionFunctions.createNewSession(
      api
    );
    if (error.isError) {
      return {
        notFound: true,
      };
    }
    setCookie(`clientV1_${country}`, sessionId.sessionId, { req, res });
    api.resetHeaders();
    api.sessionToken = sessionId.sessionId;
    api.setHeaders(headerArr).setMethod(APIMethods.GET);
  }

  if (categoryId && categoryId.length > 0) {
    //> If Session is available, set the session to API instance.
    if (api.sessionToken === "") {
      api.sessionToken = `${getCookie(`clientV1_${country}`, { req, res })}`;
    }
    api.resetHeaders();
    api.setHeaders(headerArr).setMethod(APIMethods.GET);

    if (categoryId[0] === "en-sa" || categoryId[0] === "ar-sa") {
      (categoryId as string[]).shift();
    }

    const subdirectoryPath =
      process.env.NEXT_PUBLIC_BASE_ROUTE !== "NA"
        ? `/${process.env.NEXT_PUBLIC_BASE_ROUTE}`
        : "";
    const defaultParams: defaultCategoryParams = {
      pageCount: 0,
      pageSize: 0,
    };
    const { data, error } = await categoryFunctions.getCategoryData(
      parseInt(categoryId[0]),
      api,
      `${subdirectoryPath}`,
      defaultParams
    );
    if (error.isError || !data.categoryData?.urlPath) {
      return {
        notFound: true,
      };
    }
    return {
      redirect: {
        permanent: false,
        destination: `/${data.categoryData.urlPath}`,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};
export default CategoryRedirect;
