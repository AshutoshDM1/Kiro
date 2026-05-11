"use client";
import { ChartNoAxesGantt } from "lucide-react";
import Logo from "../Logo/Logo";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-transparent">
      <div className="bg-white max-w-sm mx-auto rounded-lg shadow-sm border-3 border-neutral-100   flex justify-between ">
        <div className="flex items-center gap-2 p-2">
          <div className="bg-neutral-100/80 border rounded-lg p-1.5">
            <Logo className="size-5" />
          </div>
          <p className="text-xl font-bold">Kiro</p>
        </div>
        <div className="border-x-3 px-5 border-neutral-100 p-2 flex items-center justify-center">
          <ChartNoAxesGantt className="size-5" />
        </div>
        <div className="p-2 flex items-center justify-center">
          <Button
            className="bg-black border border-zinc-500/80 px-5 text-xs "
            onClick={() =>
              window.open("https://github.com/AshutoshDM1/kiro", "_blank")
            }
          >
            Github
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
