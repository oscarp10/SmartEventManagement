import { Mail, MapPin, Phone, Ticket } from "lucide-react";

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconTwitter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-footer-surface relative mt-auto w-full overflow-hidden text-white">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
      </div>

      <div className="relative px-6 py-12 md:px-12">
        <div className="mb-8 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Ticket className="h-6 w-6 shrink-0 text-brand-400" />
              <h3 className="text-xl font-bold">Smart Events</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              Your comprehensive event management solution for King&apos;s Own Institute. Connecting organizers and attendees with seamless event experiences.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("home")}
                  className="inline-block text-gray-300 transition-all duration-300 hover:translate-x-1 hover:text-brand-400"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("about")}
                  className="inline-block text-gray-300 transition-all duration-300 hover:translate-x-1 hover:text-brand-400"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("contact")}
                  className="inline-block text-gray-300 transition-all duration-300 hover:translate-x-1 hover:text-brand-400"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("support")}
                  className="inline-block text-gray-300 transition-all duration-300 hover:translate-x-1 hover:text-brand-400"
                >
                  Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="inline-block text-gray-300 transition-all duration-300 hover:translate-x-1 hover:text-brand-400"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-300 transition-colors duration-300 hover:text-brand-400">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="mt-1">sajad.ghatrehsamani@koi.edu.au</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 transition-colors duration-300 hover:text-brand-400">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="mt-1">+61 (0) 123 456 789</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300 transition-colors duration-300 hover:text-brand-400">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="mt-1">
                  King&apos;s Own Institute
                  <br />
                  Sydney, Australia
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-brand-600 hover:shadow-xl"
              >
                <IconFacebook className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="X (Twitter)"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-brand-600 hover:shadow-xl"
              >
                <IconTwitter className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-brand-600 hover:shadow-xl"
              >
                <IconInstagram className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-brand-600 hover:shadow-xl"
              >
                <IconLinkedin className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-300">Stay connected for the latest events and updates</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-300 md:flex-row">
            <p className="text-center md:text-left">
              © 2026 Smart Events. All rights reserved. | Kings Own Institute
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button type="button" className="transition-colors duration-300 hover:text-brand-400">
                Privacy Policy
              </button>
              <button type="button" className="transition-colors duration-300 hover:text-brand-400">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
