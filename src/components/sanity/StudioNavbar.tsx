import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import type { NavbarProps } from "sanity";

export default function StudioNavbar(props: NavbarProps) {
  return (
    <div className="bg-[#101112] text-white">
      <div className="flex items-center p-5">
        <Link href="/" className="flex items-center ">
          <FaArrowLeft className="mr-2 h-6 w-6" />
          Vissza az oldalra
        </Link>
      </div>
      <>{props.renderDefault(props)}</>
    </div>
  );
}
