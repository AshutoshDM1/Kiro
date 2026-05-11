import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div>
      <Image
        src="/favicon/favicon.svg"
        alt="logo"
        className={cn("size-12", className)}
        width={96}
        height={96}
      />
    </div>
  );
};

export default Logo;
