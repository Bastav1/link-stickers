import { useRef, useState } from "react";
import { CrossIcon } from "../icons/cross";
import { Button } from "./button";
import { Input } from "./input";
import { BACKEND_URL } from "../config";
import axios from "axios";

const ContentType = {
  Youtube: "youtube",
  Twitter: "twitter",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModal({ open, onClose }: ModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState("");
  const [type, setType] = useState(ContentType.Youtube);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    try {
      const res = await axios.post(
        BACKEND_URL + "/api/v1/content",
        {
          title,
          link,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(res.data.msg);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (e) {
      setMessages("Error occured");
    }
  }
  return (
    <>
      {open && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black-400 text-white rounded-xl min-w-96 min-h-96 p-4 shadow-lg relative">
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-2 right-2">
              <CrossIcon />
            </button>

            {/* Modal Content */}
            <div className="mt-8">
              <div>Title</div>
              <Input ref={titleRef} placeholder="Title" />
              <div>Link</div>
              <Input ref={linkRef} placeholder="Link" />
            </div>
            <div className="flex gap-2 p-2 justify-center">
              <Button
                onClick={() => setType(ContentType.Youtube)}
                variant="primary"
                text="Youtube"
                onHover={true}
              />
              <Button
                onClick={() => setType(ContentType.Twitter)}
                variant="primary"
                text="Twitter"
                onHover={true}
              />
            </div>
            <div className="flex justify-center mt-2">
              <Button onClick={addContent} variant="primary" text="Submit" />
            </div>
            <div className="flex justify-center">{messages}</div>
          </div>
        </div>
      )}
    </>
  );
}
