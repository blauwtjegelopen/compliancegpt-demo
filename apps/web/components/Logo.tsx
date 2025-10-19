// components/Logo.tsx
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      {/* Light mode logo */}
      <img
        alt="LayerZero Logo (black)"
        className="block dark:hidden h-auto w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
        src="/_next/image?url=%2Flogo-wordmark-dark%403x_New.png&w=640&q=75"
      />
      {/* Dark mode logo */}
      <img
        alt="LayerZero Logo (white)"
        className="hidden dark:block h-auto w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
        src="/_next/image?url=%2Flogo-wordmark-light%403x_New.png&w=640&q=75"
      />
    </div>
  );
}