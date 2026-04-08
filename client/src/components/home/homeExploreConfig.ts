import { CheckCircle2, Headphones, ShieldCheck, Wallet } from "lucide-react";

export const DEFAULT_CATEGORIES = ["All", "Technology", "Business", "Networking", "Music", "Art", "Food & Drink"];

export const WHY_EVENTHUB_ITEMS = [
  { title: "Approved first", body: "Public grid shows admin-approved events only.", icon: ShieldCheck },
  { title: "Attendee-friendly", body: "Browse, filter, then sign in to register.", icon: CheckCircle2 },
  { title: "Fair pricing story", body: "Free listings stay lightweight for student-run events.", icon: Wallet },
  { title: "Organizer + admin", body: "Draft, review, publish - dashboards per role.", icon: Headphones }
] as const;

export const HERO_BACKGROUND =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2400&q=85";

export function scrollToFeatured() {
  requestAnimationFrame(() => document.getElementById("featured-events")?.scrollIntoView({ behavior: "smooth" }));
}

export function formatEventDate(value: string) {
  return new Date(value).toLocaleDateString();
}

