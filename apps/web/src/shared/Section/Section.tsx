import { cn } from "@/lib/utils";

interface SectionProps {
  className?: string;
  children?: React.ReactNode;
}

const Section = ({ children, className = "" }: SectionProps) => {
  return (
    <div className={cn("max-w-7xl mx-auto px-6", className)}>{children}</div>
  );
};

export default Section;
