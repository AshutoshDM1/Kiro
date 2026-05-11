import Link from "next/link";
import Logo from "../Logo/Logo";
import Section from "../Section/Section";

const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const SOCIAL_LINKS = [
  { icon: <TwitterIcon />, name: "X", url: "#" },
  { icon: <LinkedinIcon />, name: "Linkedin", url: "#" },
  { icon: <GithubIcon />, name: "Github", url: "https://github.com/AshutoshDM1" },
];

const Footer = () => {
  return (
    <Section className="max-w-3xl">
      <footer className="py-5">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="col-span-1 md:col-span-3 max-w-60">
            <div className="flex items-center gap-2 p-2">
              <div className="bg-neutral-100/80 border rounded-lg p-1.5">
                <Logo className="size-5" />
              </div>
              <p className="text-xl font-bold">Kiro</p>
            </div>
            <p className="text-muted-foreground text-sm">
              Kiro is your unfair advantage on Solana, Built for the frontier.
              Built for you.
            </p>
          </div>

          <div className="space-y-3 mt-3">
            <h4 className="text-[11px] font-bold text-gray-400 tracking-[0.15em] uppercase">
              Follow Us On
            </h4>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  className="bg-[#0A0A0A] text-white p-2 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 text-sm text-muted-foreground bg-stone-200 rounded-sm border border-stone-300 mt-10">
          © 2026 Kiro. All rights reserved
        </div>
      </footer>
    </Section>
  );
};

export default Footer;
