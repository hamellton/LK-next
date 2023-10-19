import React, { useState, useEffect, useCallback, useRef } from "react";
import CircularLoader from "./CircularLoader";

interface Item {
    id: number;
    title: string;
}

const InfiniteLoader = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const fetchData = useCallback(async (): Promise<Item[]> => {
        const API_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";
        const response = await fetch(
            `${API_ENDPOINT}?_start=${items.length}&_limit=5`
            //   `https://api.example.com/items?start=${items.length}`
        );

        // const getPosts = (start: number, limit: number) => {
        //   return axios.get(`${API_ENDPOINT}?_start=${items.length}&_limit=5`);
        // };
        const data = await response.json();
        return data;
    }, [items.length]);
    useEffect(() => {
        if (isLoading) fetchData().then((newItems) => {
            if (newItems && Array.isArray(newItems)) setItems(items => ([...items, ...newItems]));
            setIsLoading(false);
            setHasMore(newItems?.length > 0);
        }).catch(err => console.log("err", err));
    }, [fetchData, isLoading]);



    //   const handleScroll = useCallback(() => {
    //     if (
    //       window.innerHeight + document.documentElement.scrollTop !==
    //         document.documentElement.offsetHeight ||
    //       isLoading ||
    //       !hasMore
    //     ) {
    //       return;
    //     }
    //     setIsLoading(true);
    //   }, [hasMore, isLoading]);

    //   useEffect(() => {
    //     window?.addEventListener("scroll", handleScroll);
    //     return () => window?.removeEventListener("scroll", handleScroll);
    //   }, [handleScroll]);
    // console.log(items);

    const ref = useRef<HTMLDivElement>(null);
    const handleScroll = useCallback(() => {
        if (ref.current) {
            const { scrollHeight, clientHeight, scrollTop } = ref.current;
            if (scrollHeight - clientHeight <= scrollTop + 1 && !isLoading && hasMore) {
                // console.log("Hello World");
                setIsLoading(true);
            }
        }
    }, [hasMore, isLoading]);
    useEffect(() => {

        if (ref.current) {
            ref.current.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);
    return (
        <>
            {/* <ul>
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      {isLoading && <CircularLoader />} */}
            <div
                ref={ref}
                style={{
                    height: "200px",
                    width: "200px",
                    overflowY: "scroll",
                    border: "1px solid black"
                }}
            >
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry.
                </p>
                <p>
                    Lorem Ipsum has been the industry&apos;s standard dummy text ever since the
                    1500s, when an unknown printer took a galley of type and scrambled it to
                    make a type specimen book.
                </p>
                <p>
                    It has survived not only five centuries, but also the leap into
                    electronic typesetting, remaining essentially unchanged.
                </p>
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>{item.title}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default InfiniteLoader;
