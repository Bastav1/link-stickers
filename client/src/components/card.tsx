import { ShareIcon } from "../icons/shareIcon";
import { Yt } from "../icons/yt";
import { Tweet } from "../icons/tweet";
import { Trash } from "../icons/trash";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface cardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  contentId?: string | number;
  time?:string
}

export function Card({ title, link, type, contentId,time }: cardProps) {
  //remove function
  async function remove() {
    if (!contentId) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        data: { contentId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Content deleted");
      window.location.reload()
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="p-4 bg-black-500 rounded-md text-white max-w-72 min-h-48  border  shadow-md">
      <div className="flex justify-between text-white">
        <div className="flex items-center ">
          <div className="pr-2  text-gray-200">
            {type === "youtube" && <Yt />}
            {type === "twitter" && <Tweet />}
          </div>
          {title}
        </div>

        <div className="flex items-center text-gray-500">
          <div className="pr-2">
            <a href={link} target="_blank">
              <ShareIcon />
            </a>
          </div>
          <Trash onClick={remove} />
        </div>
      </div>

      <div className="pt-4">
        {type === "youtube" && (
          <iframe
            className="w-full rounded-md mt-3 "
            src={link.replace("watch?v=", "embed/")}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            //@ts-ignore
            allowFullscreen
          ></iframe>
        )}

        {type == "twitter" && (
          <blockquote className="twitter-tweet  mt-3">
            <a href={link.replace("x.com", "twitter.com")}></a>
          </blockquote>
        )}
      </div>
      {time && <div className="text-sm p-4 text-white">created on: {time}</div>}
    </div>
  );
}
