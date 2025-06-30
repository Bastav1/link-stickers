import type { ReactElement } from "react";

interface SideBarItemFormat {
  text: string;
  icon?: ReactElement;
  onClick?: () => void;
}
export default function SideBarItem({ text, icon,onClick }: SideBarItemFormat) {
  return (
    <div className="flex items-center p-2 mt-2 gap-2 ml-2 cursor-pointer transition-all duration-150 hover:bg-gray-400 rounded" onClick={onClick}>
      <div className="text-md text-white">{icon}</div>
      <div className="text-base font-medium">{text}</div>
    </div>
  );
}
