import SideBarItem from "./sidebar_item";
import { Tweet } from "../icons/tweet";
import { Yt } from "../icons/yt";
import { Brain } from "../icons/brain";
import { Link } from "../icons/link";
import { Tags } from "../icons/tags";
import { Documenttt } from "../icons/document";
import { Git } from "../icons/git";
import { useNavigate } from "react-router-dom";


export function SideBaar() {
  const navigate= useNavigate();
  return (
    <div className=" h-screen rounded bg-black-600 border-r text-white min-w-12 sm:min-w-72 transition-width fixed top-0 left-0 p-4 font-custom">
      <div className="flex items-center">
        <div className="text-purple-400" onClick={()=>navigate("/")}>
          <Brain />
        </div>
        <div className="text-2xl font-bold ml-2">Second Brain</div>
      </div>

      <SideBarItem text="Tweets" icon={<Tweet />} onClick={()=>navigate("/twitter")}/>
      <SideBarItem text="Videos" icon={<Yt />} onClick={()=>navigate("/youtube")}/>
      <SideBarItem text="Git" icon={<Git />} />
      <SideBarItem text="Document" icon={<Documenttt />} />
      <SideBarItem text="Link" icon={<Link />} />
      <SideBarItem text="Tags" icon={<Tags />} />
    </div>
  );
}
