import Image from "next/image";
import Link from "next/link";
import React from "react";

function HeaderLogo() {
  return (
    <Link href="/" className="group">
      <div className="items-center hidden lg:flex">
        <Image src="/logo.svg" alt="logo" height={28} width={28} />
        <p className="font-semibold text-zinc-100 text-2xl ml-2 group-hover:text-white transition">
          Finance
        </p>
      </div>
    </Link>
  );
}

export default HeaderLogo;
