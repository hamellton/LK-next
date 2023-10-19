export interface HeaderType {
  navigationData?: any;
  menu: {
    label: string;
    url: string;
    id: string;
    type: string;
    data:
      | {
          defaultGender: number;
          genders: {
            id: number;
            text: string;
            url: string;
            img: string;
            submenuIds: string[];
            defaultCategoryId: string;
          }[];
          categories: {
            id: string;
            text: string;
            subtext: string;
            submenuIds: string[];
          }[];
          subCategories: { id: string; text: string; submenuIds: string[] }[];
          links: {
            [key: string]: { id: string; text: string; url: string };
          };
        }
      | { id: string; text: string; img: string; url: string }[]
      | {
          id: string;
          text: string;
          links: { id: string; text: string; url: string }[];
        }
      | {
          singleImg: true;
          img: {
            url: string;
            img: string;
          };
          head: string;
          content: string[];
          button: {
            text: string;
            link: string;
          };
        }
      | {
          singleImg: false;
          imgs: {
            url: string;
            img: string;
            city: string;
          }[];
          head: string;
          content: string[];
          button: {
            text: string;
            link: string;
          };
        };
  }[];
  imageLink: {
    imgLink: string;
    url: string;
    altText: string;
  }[];
}
