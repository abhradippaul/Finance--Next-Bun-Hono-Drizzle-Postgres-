"use client";
import { useUser } from "@clerk/nextjs";

function WelcomeMsg() {
  const { user } = useUser();
  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
        Welcome Back, {user?.firstName}
      </h2>
      <p className="text-sm lg:text-base text-[#89b6fd]">
        This is you Finacial Overview Report
      </p>
    </div>
  );
}

export default WelcomeMsg;
