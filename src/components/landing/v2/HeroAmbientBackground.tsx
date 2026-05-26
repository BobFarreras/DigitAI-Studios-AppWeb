/**
 * @file src/components/landing/v2/HeroAmbientBackground.tsx
 * @updated 2026-05-25
 * @summary Fons decoratiu CSS pur per a la landing v2. Zero JS animation loop.
 * @scope Renderitzar textura decorativa sense afectar rendiment.
 */
export function HeroAmbientBackground({ className = 'absolute inset-0' }: { className?: string }) {
  return (
    <div className={`pointer-events-none z-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,9,10,0.06),transparent_40%,rgba(35,37,42,0.08))] dark:bg-[linear-gradient(135deg,rgba(138,143,152,0.08),transparent_42%,rgba(98,102,109,0.06))]" />
      <div className="absolute left-[-12%] top-[12%] h-[70vh] w-[44vw] rounded-full bg-[#08090a]/10 blur-[110px] dark:bg-[#8a8f98]/8" />
      <div className="absolute right-[-14%] top-[22%] h-[70vh] w-[46vw] rounded-full bg-[#08090a]/10 blur-[110px] dark:bg-[#8a8f98]/7" />
      <div className="absolute left-[50%] top-[48%] h-[58vh] w-[68vw] -translate-x-1/2 rounded-full bg-[#62666d]/6 blur-[120px] dark:bg-[#62666d]/8" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(247,248,248,0.18)_92%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,9,10,0.46)_92%)]" />
    </div>
  );
}
