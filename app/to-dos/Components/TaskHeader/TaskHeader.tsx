import { UserProfile } from "./UserProfile";

import { SearchButton } from "./SearchButton";
import { FaCheckDouble } from "react-icons/fa6";

export function TaskHeader() {
  return (
    <div className="flex justify-between  items-center mb-6">
      <AppLogo />
      <div className="flex items-center gap-1 ">
        <SearchButton />
        <UserProfile />
      </div>
    </div>
  );
}

function AppLogo() {
  return (
    <div className="flex gap-2 items-center justify-center    ">
      <div className="bg-primary p-2 text-white rounded-sm text-xl ">
        <FaCheckDouble />
      </div>

      <div className="font-bold  text-3xl flex gap-1 justify-center items-center">
        <span className="text-primary">Quick</span>
        <span>Task</span>
      </div>
    </div>
  );
}
