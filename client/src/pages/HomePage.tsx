import { HomeExplore } from "../components/HomeExplore";
import type { Page, PublicEvent } from "../app-types";

export type HomePageProps = {
  events: PublicEvent[];
  onNavigate: (page: Page) => void;
  onCreateEvent?: () => void;
  isAuthenticated: boolean;
};

export function HomePage({ events, onNavigate, onCreateEvent, isAuthenticated }: HomePageProps) {
  return (
    <HomeExplore events={events} onNavigate={onNavigate} onCreateEvent={onCreateEvent} isAuthenticated={isAuthenticated} />
  );
}
