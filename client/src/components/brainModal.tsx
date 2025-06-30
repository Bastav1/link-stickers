import { useRef } from "react";
import { CrossIcon } from "../icons/cross";
import { Button } from "./button";
import { Input } from "./input";
import { useNavigate } from "react-router-dom";

interface Modal {
  open: boolean;
  onClose: () => void;
}
export function BrainModal({ open, onClose }: Modal) {
  const inputLink = useRef<HTMLInputElement>(null);
  const navigate=useNavigate();

  function openFunc() {
    const link = inputLink.current?.value;
     if (link) {
      navigate(`/brain/${link}`);
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

            <div className="p-4 text-xl">Open Brain...</div>
            <Input placeholder="Paste a link" ref={inputLink} />
            <div className="flex mt-2 justify-center">
              <Button onClick={openFunc} variant="primary" text={"Open"} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
