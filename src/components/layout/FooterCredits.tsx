import { IconGithub, IconLinkedin } from "../common/Icons";

export function FooterCredits() {
  return (
    <div className="text-center">
      <p className="text-[0.6rem] leading-tight text-stone-400">Developed and maintained by N. Nibras</p>
      <div className="mt-1 flex items-center justify-center gap-2.5 text-stone-400">
        <a href="https://github.com/nnibras" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-stone-700 dark:hover:text-stone-200">
          <IconGithub className="h-3 w-3" />
        </a>
        <a href="https://www.linkedin.com/in/nafinibras" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-stone-700 dark:hover:text-stone-200">
          <IconLinkedin className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
