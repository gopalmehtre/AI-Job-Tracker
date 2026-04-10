interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => (
  <div
    className={`${sizeMap[size]} animate-spin rounded-full border-2 border-slate-600 border-t-indigo-400 ${className}`}
  />
);

export default Spinner;
