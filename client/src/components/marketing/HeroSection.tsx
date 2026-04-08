export function HeroSection({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <section
      className="relative overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl md:p-12"
      style={{
        backgroundImage: `linear-gradient(95deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.6)), url('${image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <h1 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-200 md:text-base">{subtitle}</p>
    </section>
  );
}
