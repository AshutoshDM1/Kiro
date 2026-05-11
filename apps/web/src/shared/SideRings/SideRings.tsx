"use client";
import { cn } from "@/lib/utils";
import { Shield, Heart, Zap, Star, Anchor, Bell, Camera, Cloud, Compass, Crown, Diamond, Flame } from "lucide-react";
import { motion } from "motion/react";

interface SizeProps {
  firstRingSize: number;
  secondRingSize?: number;
  thirdRingSize?: number;
  fourthRingSize?: number;
  icons?: boolean;
  className?: string;
  reverse?: boolean;
}

const ICONS = [Zap, Heart, Star, Shield, Anchor, Bell, Camera, Cloud, Compass, Crown, Diamond, Flame];

const Ring = ({
  size,
  children,
  isFirst,
}: {
  size: number;
  children?: React.ReactNode;
  isFirst?: boolean;
}) => {
  const ringDifference: number = 20;
  const innerSize = size - ringDifference;

  const outerRing =
    "rounded-full shadow-[inset_0px_0px_10px_0px_rgba(6,6,18,0.22)] flex items-center justify-center shrink-0";
  const innerRing =
    "rounded-full shadow-[0px_0px_10px_0px_rgba(6,6,18,0.06)] bg-[#F5F4F3] border border-white/30 flex items-center justify-center shrink-0 relative";

  return (
    <div
      className={outerRing}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div
        className={innerRing}
        style={{ width: `${innerSize}px`, height: `${innerSize}px` }}
      >
        {isFirst && ICONS.map((Icon, i) => {
          const angle = (i * 30 * Math.PI) / 180 - Math.PI / 2;
          const radius = innerSize / 2;
          const x = radius + radius * Math.cos(angle);
          const y = radius + radius * Math.sin(angle);
          
          return (
            <div
              key={i}
              className="absolute bg-white p-4 rounded-md shadow-md flex items-center justify-center z-10"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Icon className="size-8 text-zinc-400" />
            </div>
          );
        })}
        {children}
      </div>
    </div>
  );
};

const RingStack = ({
  sizes,
  index = 0,
}: {
  sizes: number[];
  index?: number;
}) => {
  if (sizes.length === 0) return null;
  const [currentSize, ...restSizes] = sizes;

  return (
    <Ring size={currentSize} isFirst={index === 0}>
      {restSizes.length > 0 && (
        <RingStack sizes={restSizes} index={index + 1} />
      )}
    </Ring>
  );
};

const SideRings = ({
  firstRingSize,
  secondRingSize,
  thirdRingSize,
  fourthRingSize,
  className,
  reverse,
}: SizeProps) => {
  const sizes = [
    firstRingSize,
    secondRingSize,
    thirdRingSize,
    fourthRingSize,
  ].filter((size): size is number => size !== undefined);

  return (
    <motion.div
      className={cn(
        "hidden absolute top-0 w-full h-full z-50 xl:flex items-center justify-center",
        className,
      )}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ ease: "linear", duration: 70, repeat: Infinity }}
    >
      <div className={cn("flex items-center justify-center")}>
        <RingStack sizes={sizes} />
      </div>
    </motion.div>
  );
};

export default SideRings;
