import { FaCheckDouble } from "react-icons/fa6";

export const description =
  "A simple login form with email and password. The submit button says 'Sign in'.";

export function AppLogo() {
  return (
    <div className="flex gap-2 items-center mb-11 justify-center   ">
      <div className="bg-primary p-2 text-white rounded-sm text-lg ">
        <FaCheckDouble />
      </div>

      <div className="font-bold  text-2xl flex gap-1 justify-center items-center">
        <span className="text-primary">Quick</span>
        <span>Task</span>
      </div>
    </div>
  );
}
