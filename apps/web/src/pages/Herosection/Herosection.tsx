import { Button } from "@/components/ui/button";

const DottedChevronRight = () => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="opacity-40" 
    strokeDasharray="2 3"
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const DottedChevronLeft = () => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="opacity-40" 
    strokeDasharray="2 3"
  >
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const Herosection = () => {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center justify-center space-x-3 px-3 py-1.5 rounded-md border border-gray-200/60 bg-gray-50/50 shadow-sm mb-2">
          <DottedChevronLeft />
          <span className="text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase">
            Digital Agency
          </span>
          <DottedChevronRight />
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.15]">
          We design brands <br className="hidden sm:block" />
          that move <span className="text-primary">people</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl text-lg sm:text-xl text-gray-500 font-medium leading-relaxed mt-4">
          We combine strategy, design, and technology to help ambitious brands stand out & create meaningful digital experiences.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full sm:w-auto">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-[#ff5a1f] hover:bg-[#e04a18] text-white font-semibold text-base px-8 py-6 rounded-xl shadow-lg shadow-[#ff5a1f]/20 transition-all"
          >
            Discuss your ideas
          </Button>
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-[#0a0a0a] hover:bg-[#222222] text-white font-semibold text-base px-8 py-6 rounded-xl shadow-lg transition-all"
          >
            View services
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Herosection;