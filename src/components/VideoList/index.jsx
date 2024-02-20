import { useState } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player/youtube";

import useFetchSingleVideo from "../../apis/useFetchSingleVideo";

import CONSTANT from "../../constants/constant";

function VideoList({ innerRef, youtubeVideoId }) {
  const [isHover, setIsHover] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const { data: video, isFetching } = useFetchSingleVideo(youtubeVideoId);

  function handleMouseEnter(event) {
    setTimeout(() => {
      setIsHover(true);
    }, 300);
    event.stopPropagation();
  }

  function handleMouseLeave(event) {
    setIsHover(false);
    event.stopPropagation();
  }

  return (
    <div>
      {!isFetching && (
        <Link to={`/watch?${video.youtubeVideoId}`} state={{ video }}>
          <div
            ref={innerRef}
            className="flex justify-center sm:justify-between w-screen gap-x-6 sm:p-2"
          >
            <div className="flex flex-col sm:flex-row min-w-0 gap-x-4">
              {isAvailable ? (
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <ReactPlayer
                    style={{
                      flex: "none",
                      borderColor: "rgb(100 116 139)",
                      backgroundColor: "rgb(249 250 251)",
                    }}
                    width={400}
                    height={225}
                    url={CONSTANT.YOUTUBE_URL + youtubeVideoId}
                    playing={isHover}
                    onError={() => {
                      setIsAvailable(false);
                    }}
                  />
                </div>
              ) : (
                <img
                  className="h-[225px] flex-none rounded-md bg-gray-50"
                  src={video.thumbnailURL}
                  alt="thumbnail"
                />
              )}

              <div className="min-w-0 flex-auto">
                <p className="text-lg w-[355px] sm:w-full pt-2 pb-4 font-semibold leading-6 text-gray-900">
                  {video.title}
                </p>
                <p className="hidden sm:block mt-1 truncate text-sm leading-5 text-gray-600">
                  {video.channel}
                </p>
                <p className="hidden sm:block mt-4 truncate text-xs leading-3 text-gray-500">
                  {video.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default VideoList;
