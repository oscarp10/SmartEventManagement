import { Calendar, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  /** Short line above the main title on the left panel */
  eyebrow?: string;
  /** Primary headline on the left panel */
  headline: string;
  subheadline?: string;
};

export function AuthShell({ children, eyebrow = "King's Own Institute", headline, subheadline }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100dvh-0px)] flex-col bg-page lg:flex-row">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 px-6 py-10 text-white sm:px-10 lg:w-[42%] lg:max-w-xl lg:shrink-0 lg:py-14 xl:w-[45%]">
        <GradientOrbs />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-white" />
            <span>{eyebrow}</span>
          </div>
          <h1 className="mt-8 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">{headline}</h1>
          {subheadline && <p className="mt-4 max-w-md text-base text-white/85 sm:text-lg">{subheadline}</p>}

          <ul className="mt-10 hidden max-w-md space-y-4 sm:block">
            {[
              { icon: Users, text: "Attendees discover and register with a guided, card-first experience." },
              { icon: Calendar, text: "Organizers publish rich listings and track engagement." },
              { icon: ShieldCheck, text: "Admins keep the catalog trustworthy with review workflows." }
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                <span className="text-sm leading-relaxed text-white/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative mt-8 hidden text-sm text-white/70 lg:block">EventHub · Smart Event Management</p>
      </aside>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 lg:py-14">
        <div className="animate-fade-in w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-20">
      <div className="absolute left-[10%] top-[15%] h-56 w-56 rounded-full bg-white blur-3xl" />
      <div className="absolute bottom-[10%] right-[5%] h-72 w-72 rounded-full bg-white blur-3xl" />
    </div>
  );
}
