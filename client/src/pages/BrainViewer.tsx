import { Button } from "../components/button";
import { PlusIcon } from "../icons/plusIcon";
import { Card } from "../components/card";
import { CreateContentModal } from "../components/createContentModal";
import { useEffect, useState } from "react";
import { SideBaar } from "../components/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { Empty } from "../components/empty";
import { ShareModal } from "../components/shareModal";
import { BrainModal } from "../components/brainModal";
import { Loader } from "../components/loader";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function BrainViewer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [smodal, setSmodal] = useState(false);
  const [bmodal, setBmodal] = useState(false);
  const [contents, setContents] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { hash } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function func() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/brain/${hash}`);
        setContents(res.data.content || []);
        setName(res.data.username || "");
        console.log(contents);
      } catch (e) {
        console.error("Failed to fetch contents:", e);
        setContents([]);
      } finally {
        setLoading(false);
      }
    }
    func();
  }, [hash]);

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
          <div className="font-bold text-2xl">
            {name ? `${name}'s Notes` : "All Notes"}
          </div>

          <div className="flex gap-2 flex-wrap">
            {token && (<Button
              onClick={() => {
                setModalOpen(true);
              }}
              variant="primary"
              text="Add content"
              startIcon={<PlusIcon />}
            />)}

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
          {loading && <Loader />}
          {!loading && token && contents.length === 0 && <Empty />}{" "}
          {contents.length > 0 &&
            contents.map(({ title, type, link, _id }) => (
              <div key={_id}>
                {" "}
                <Card title={title} type={type} link={link} contentId={_id} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
