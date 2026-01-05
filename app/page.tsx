import { ArtodeTitle } from "@/components/artode-title";
import { IconBrowser } from "@/components/icon-browser";
import paths from "@/paths.json";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";

export default function Home() {
    const allIcons = Object.entries(paths) as [string, string][];

    // Categories mapping
    const CATEGORIES: Record<string, string[]> = {
        "Languages": ["Go", "Java", "PHP", "Ruby", "Swift", "Kotlin", "C++", "C#", "Python", "Rust", "TypeScript", "JavaScript", "C", "Objective-C", "R", "Dart", "Elixir", "Haskell", "Lua", "Perl", "Scala", "Shell"],
        "Frameworks": ["Vue.js", "Svelte", "Angular", "Astro", "Django", "Laravel", "Spring", "Flutter", "React", "Next.js", "Node.js", "Tailwind", "Bootstrap", "Express", "FastAPI", "Flask", "Gatsby", "Nuxt.js", "Rails", "Remix", "Symfony", "Electron", "Ionic", "jQuery", "Qt", "Redux", "Sass", "Solid", "Styled Components", "Three.js", "Vite", "Webpack"],
        "Social": ["X", "Twitter", "YouTube", "LinkedIn", "Instagram", "OpenAI", "Behance", "Medium", "Twitch", "TikTok", "Pinterest", "Reddit", "WhatsApp", "Telegram", "Facebook", "Snapchat", "Mastodon", "Patreon", "Substack", "Tumblr"]
    };

    return (
        <main className="flex min-h-screen flex-col items-center bg-background text-foreground selection:bg-primary/20 selection:text-primary">
            <div className="w-full max-w-[1200px] border-x border-secondary/10 min-h-screen flex flex-col">
                <SiteHeader />
                <Hero totalIcons={allIcons.length} />

                <IconBrowser allIcons={allIcons} categories={CATEGORIES} />

                <footer className="mt-auto py-12 text-center font-mono text-[10px] text-secondary/40 tracking-widest uppercase border-t border-secondary/10">
                    © {new Date().getFullYear()} Artode Design // Inspired by Lucide
                </footer>
            </div>
        </main>
    );
}
