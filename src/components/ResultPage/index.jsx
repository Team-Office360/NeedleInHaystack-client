import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Header from "../Header";
import SearchInput from "../SearchInput";
import VideoList from "../VideoList";
import { Loading, LoadingSpin } from "../shared/Loading";

import useFetchAllVideos from "../../apis/useFetchAllVideos";
import { useCheckSpellStore } from "../../store/store";

function ResultPage() {
  const location = useLocation();
  const { shouldCheckSpell, setShouldCheckSpell } = useCheckSpellStore();
  const query = location.search.split("?search_query=")[1];
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    shouldCheckSpell
      ? useFetchAllVideos(query)
      : useFetchAllVideos(query, false);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  function handleSearchInsteadClick() {
    if (shouldCheckSpell) {
      setShouldCheckSpell(false);
    } else {
      setShouldCheckSpell(true);
    }
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <Header />
      <SearchInput />
      {status === "pending" && <Loading />}
      {status === "error" && (
        <div className="mt-10 text-center font-bold">
          <div className="text-xl">No results found</div>
          <p className="mt-4">
            Try different keywords or remove search filters
          </p>
        </div>
      )}
      {status === "success" &&
        (data.pages[0].result !== "null" ? (
          <>
            {data.pages[0].query !== data.pages[0].correctedInput && (
              <p className="mt-3 mb-3">
                Showing results for
                <span className="font-bold italic ml-2 mr-2" role="button">
                  {data.pages[0].correctedInput}
                </span>
                Search instead for
                <span
                  className="font-bold ml-2 hover:text-purple-900 hover:underline"
                  onClick={handleSearchInsteadClick}
                  role="button"
                  tabIndex={0}
                >
                  {data.pages[0].query}
                </span>
              </p>
            )}
            {data.pages.map((group) =>
              group.videos.map((video, index) => {
                const youtubeVideoId = video[0];
                if (group.videos.length === index + 1) {
                  return (
                    <VideoList
                      innerRef={ref}
                      key={youtubeVideoId}
                      youtubeVideoId={youtubeVideoId}
                    />
                  );
                }
                return (
                  <VideoList
                    key={youtubeVideoId}
                    youtubeVideoId={youtubeVideoId}
                  />
                );
              }),
            )}
            {isFetchingNextPage && <LoadingSpin />}
            <div>{!hasNextPage ? "Nothing more to load" : "more..."}</div>
          </>
        ) : (
          <div className="mt-3 text-center">
            {!shouldCheckSpell && (
              <p className="mb-10 text-4xl">
                Did you mean
                <span
                  className="font-bold italic ml-2 hover:text-purple-900 hover:underline"
                  onClick={handleSearchInsteadClick}
                  role="button"
                  tabIndex={0}
                >
                  {data?.pages[0].recommendedSearchKeyword}
                </span>
                ?
              </p>
            )}
            <p className="mb-10">
              Your search -
              <span className="font-bold ml-2 mr-2">
                {data?.pages[0].query}
              </span>
              did not match any documents.
            </p>
            <div className="text-xl font-bold">No results found</div>
            <p className="font-bold mt-5">
              Try different keywords or remove search filters
            </p>
          </div>
        ))}
    </div>
  );
}

export default ResultPage;
