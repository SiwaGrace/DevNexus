import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header>
      <nav className="flex justify-between items-center py-4 px-8">
        <Link href="/" className="logo">
          <Image
            src="/icons/logo.png"
            alt="Dev Nexus Logo"
            width={24}
            height={24}
          />
          <p>DevNexus</p>
        </Link>
        {/* Navigation Links */}
        <ul>
          <Link href="/">Home</Link>
          <Link href="/">Events</Link>
          <Link href="/">Create Events</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
