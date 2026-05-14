"use client";
import { Button } from "@/components/ui/button";
import Badge from "@/shared/Badge/Badge";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FlotingTextProps {
  className?: string;
}

const FlotingText = ({ className }: FlotingTextProps) => {
  return (
    <>
      <div
        className={cn(
          "absolute -left-34 top-2 flex items-start pr-3",
          className,
        )}
      >
        <span
          className="text-primary text-2xl whitespace-nowrap mt-4 mr-2"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          Give a Star
        </span>
        <Image
          width={40}
          height={40}
          src="/icons/arrow.svg"
          alt="arrow"
          className="w-8 h-8 translate-y-1"
        />
      </div>
    </>
  );
};

const Herosection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install -g kiro-agent");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col justify-center items-center max-w-3xl mx-auto gap-4 py-40">
      <Badge text="Kiro Agent" />
      <h1 className="text-4xl md:text-6xl font-medium text-center leading-10 md:leading-16">
        All your commands, in one{" "}
        <span className="text-primary">Intelligent</span> terminal
      </h1>
      <p className="text-center font-medium text-muted-foreground">
        Kiro is a Solana terminal assistant that lets you interact with your
        wallet and tokens using simple natural language commands.
      </p>
      <div className="mt-6 flex flex-col-reverse sm:flex-row items-center gap-2">
        <Button
          onClick={() =>
            window.open("https://github.com/AshutoshDM1/kiro", "_blank")
          }
          className="relative rounded-sm p-4 text-sm font-medium bg-primary border-orange-600 shadow-sm "
        >
          <FlotingText />
          Github
        </Button>
        <div className="shadow-cm p-2 px-4 rounded-sm flex items-center justify-center gap-2">
          <span className=" text-sm whitespace-nowrap  ">
            npm install -g kiro-agent
          </span>
          <motion.button
            initial={{ opacity: 1, scale: 1, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={handleCopy}
            className="relative flex items-center justify-center w-6 h-6 ml-1 cursor-pointer"
          >
            {copied ? (
              <Check className="text-primary size-4 " />
            ) : (
              <Copy className="text-primary size-4 " />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Herosection;
