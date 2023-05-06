import LogoBase from "@/../public/images/logo_base.png";
import Image from "next/image";
import type { LogoProps } from "sanity";

export default function Logo(props: LogoProps) {
  return (
    <div className="flex items-center space-x-2">
      <Image className="rounded-full object-cover" height={50} width={50} src={LogoBase} alt="BASE Logo" />
      <>{props.renderDefault(props)}</>
    </div>
  );
}
