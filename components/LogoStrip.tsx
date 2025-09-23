// components/LogoStrip.tsx
export default function LogoStrip() {
  // Add as many teams as you like
  const teams = [
    'Acme Corp',
    'Globex',
    'Initech',
    'Umbrella',
    'Soylent',
    'Hooli',
    'Vandelay',
    'Wonka',
    'Stark Industries',
    'Wayne Enterprises',
    'Tyrell',
    'Cyberdyne',
  ];

  // Show exactly one full row per breakpoint: 2 (base), 3 (sm), 4 (md), 6 (lg+)
  const visibilityForIndex = (i: number) =>
    `${i < 2 ? 'block' : 'hidden'} ` +         // base: 2
    `${i < 3 ? 'sm:block' : 'sm:hidden'} ` +   // sm: 3
    `${i < 4 ? 'md:block' : 'md:hidden'} ` +   // md: 4
    `${i < 6 ? 'lg:block' : 'lg:hidden'}`;     // lg+: 6

  return (
    <section className="bg-white">
      <div className="w-full px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-center text-xs md:text-sm font-medium mb-6 text-gray-500 dark:text-gray-300">
          Trusted by teams
        </h2>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {teams.map((name, i) => (
            <li
              key={name}
              className={visibilityForIndex(i)}
            >
              {/* Capsule */}
              <div
                className="h-10 rounded-md bg-transparent
                           border border-gray-100 dark:border-gray-300/30
                           grid place-items-center text-center
                           px-3 text-sm font-medium
                           text-gray-800 dark:text-gray-300"
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