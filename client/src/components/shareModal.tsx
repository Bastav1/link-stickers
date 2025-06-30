import { useState } from "react";
import { useContent } from "../hooks/useContext";
import { Copy } from "../icons/copy";
import { CrossIcon } from "../icons/cross";
import { Button } from "./button";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Modal {
  open: boolean;
  onClose: () => void;
}
export function ShareModal({ open, onClose }: Modal) {
  const contents = useContent();
  const [copied, setCopied] = useState(false);
  const [unshared, setUnshared] = useState(false);
  const size = contents.length;
  const [sharedHash, setSharedHash] = useState<string | null>(
    localStorage.getItem("hash")
  );

  async function copyFunc(text: string) {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: text === "share" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const hash = res.data.hash;

      if (hash) {
        await navigator.clipboard.writeText(hash);
        setCopied(true);
        localStorage.setItem("hash", hash);
        setSharedHash(hash);
        console.log("Copied to clipboard");
      } else {
        localStorage.removeItem("hash");
        setUnshared(true);

        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (e) {
      console.error("Error in share/unshare:", e);
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

            <div className="p-4 text-xl">Share Your Second Brain</div>
            <div className="mt-2 mb-2 p-4 gap-2">
              Share your entire collection of notes, documents,
              <div> tweets and videos with others. They'll be able to </div>
              <div>import your content into their own Second Brain </div>
            </div>

            {/* Modal Content */}
            <div className="flex mt-2 justify-center">
              {!sharedHash && (
                <Button
                  onClick={() => copyFunc("share")}
                  variant="primary"
                  text={copied ? "Copied" : "Share Brain"}
                  startIcon={<Copy />}
                />
              )}
              {sharedHash && (
                <Button
                  onClick={() => copyFunc("unshare")}
                  variant="primary"
                  text={unshared ? "Done" : "Unshare"}
                />
              )}
            </div>
            {!sharedHash && (
              <div className="flex text-gray-200 justify-center mt-4">
                {size > 1
                  ? `${size} items will be shared`
                  : `${size} item will be shared`}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
