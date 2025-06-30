import { Button } from "../components/button";
import { ShareIcon } from "../icons/shareIcon";
import { PlusIcon } from "../icons/plusIcon";
import { Card } from "../components/card";
import { CreateContentModal } from "../components/createContentModal";
import { useState } from "react";
import { SideBaar } from "../components/sidebar";
import { useContent } from "../hooks/useContext";
import { useNavigate } from "react-router-dom";
import { Empty } from "../components/empty";
import { Empty2 } from "../components/empty2";
import { ShareModal } from "../components/shareModal";
import { Bulb } from "../icons/bulb";
import { BrainModal } from "../components/brainModal";
import { Loader } from "../components/loader";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [smodal, setSmodal] = useState(false);
  const [bmodal, setBmodal] = useState(false);
  const contents = useContent();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div>
      <SideBaar />
      <div className=" bg-black-800 min-h-screen font-custom  text-white p-4 ml-72">
        <ShareModal open={smodal} onClose={() => setSmodal(false)} />
        <BrainModal open={bmodal} onClose={() => setBmodal(false)} />
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen((c) => !c)}
        />
        {/* Top bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="font-bold text-2xl">All Notes</div>

          <div className="flex gap-2 flex-wrap">
            {localStorage.getItem("token") && (
              <Button
                onClick={() => {
                  setSmodal(true);
                }}
                variant="secondary"
                text="Share Brain"
                startIcon={<ShareIcon />}
              />
            )}

            <Button
              onClick={() => {
                setBmodal(true);
              }}
              variant="primary"
              text="Open Brain"
              startIcon={<Bulb />}
            />
            {token && (
              <Button
                onClick={() => {
                  setModalOpen(true);
                }}
                variant="primary"
                text="Add content"
                startIcon={<PlusIcon />}
              />
            )}
            {!token && (
              <Button
                onClick={() => {
                  navigate("/signup");
                }}
                variant="primary"
                text="Join Free"
              />
            )}
            {!token && (
              <Button
                onClick={() => {
                  navigate("/signin");
                }}
                variant="primary"
                text="Log In"
              />
            )}
            {token && (
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                variant="secondary"
                text="Log Out"
              />
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 flex-wrap">
          {!localStorage.getItem("token") && <Empty2 />}
          {!contents && <Loader />}
          {contents.length === 0 && localStorage.getItem("token") && <Empty />}

          {contents.length > 0 &&
            contents.map(({ title, type, link, _id,time }) => (
              <div key={_id}>
                {" "}
                <Card title={title} type={type} link={link} contentId={_id} time={time}/>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
