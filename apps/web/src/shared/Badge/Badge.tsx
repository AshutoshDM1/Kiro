interface BadgeProps {
  text: string;
}

const Badge = ({ text }: BadgeProps) => {
  return (
    <div className="flex items-center justify-center gap-2 w-fit shadow-cm rounded-[2px] bg-neutral-100 px-3 py-1">
      <DottedChevron />
      <span className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">
        {text}
      </span>
      <DottedChevron />
    </div>
  );
};

export default Badge;

const DottedChevron = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-dots-diagonal-2"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M16 17a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    </svg>
  );
};
