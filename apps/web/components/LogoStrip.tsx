// components/LogoStrip.tsx
export default function LogoStrip() {
  // Add as many teams as you like
  const teams = [
    "Acme Corp",
    "Globex",
    "Initech",
    "Umbrella",
    "Soylent",
    "Hooli",
    "Vandelay",
    "Wonka",
    "Stark Industries",
    "Wayne Enterprises",
    "Tyrell",
    "Cyberdyne",
  ];

  // Show exactly one full row per breakpoint: 2 (base), 3 (sm), 4 (md), 6 (lg+)
  const visibilityForIndex = (i: number) =>
    `${i < 2 ? "block" : "hidden"} ` + // base: 2
    `${i < 3 ? "sm:block" : "sm:hidden"} ` + // sm: 3
    `${i < 4 ? "md:block" : "md:hidden"} ` + // md: 4
    `${i < 6 ? "lg:block" : "lg:hidden"}`; // lg+: 6

  return (
    <section className="bg-white dark:bg-gray-950">
      <div className="w-full px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-center text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide uppercase mb-6 text-gray-600 dark:text-gray-300">
          Trusted by teams
        </h2>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {teams.map((name, i) => (
            <li key={name} className={visibilityForIndex(i)}>
              {/* Capsule */}
              <div
                className="
                  h-10 rounded-md px-3 grid place-items-center text-center
                  text-sm font-medium
                  bg-gray-50 border border-gray-200 text-gray-700
                  dark:bg-white/5 dark:border-white/10 dark:text-gray-200
                "
              >
                {name}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}