import { ArtodeIcon } from "@/components/artode-icon";
import { ArtodeTitle } from "@/components/artode-title";
import paths from "@/paths.json";

export default function Home() {
    const allIcons = Object.entries(paths);

    // Categories mapping
    const CATEGORIES: Record<string, string[]> = {
        "Languages": ["Go", "Java", "PHP", "Ruby", "Swift", "Kotlin", "C++", "C#", "Python", "Rust", "TypeScript", "JavaScript", "C", "Objective-C", "R", "Dart", "Elixir", "Haskell", "Lua", "Perl", "Scala", "Shell"],
        "Frameworks": ["Vue.js", "Svelte", "Angular", "Astro", "Django", "Laravel", "Spring", "Flutter", "React", "Next.js", "Node.js", "Tailwind", "Bootstrap", "Express", "FastAPI", "Flask", "Gatsby", "Nuxt.js", "Rails", "Remix", "Symfony", "Electron", "Ionic", "jQuery", "Qt", "Redux", "Sass", "Solid", "Styled Components", "Three.js", "Vite", "Webpack"],
        "Databases": ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Supabase", "Firebase", "GraphQL", "SQLite", "Cassandra", "CockroachDB", "Elasticsearch", "MariaDB", "Neo4j", "Oracle", "PlanetScale", "Prisma", "Realm", "Snowflake"],
        "Cloud & DevOps": ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Vercel", "Netlify", "Heroku", "DigitalOcean", "Cloudflare", "Datadog", "Grafana", "Jenkins", "Nginx", "Prometheus", "Terraform", "Ansible", "CircleCI", "GitLab CI", "Travis CI"],
        "Tools & Platforms": ["VS Code", "Git", "Bun", "PNPM", "npm", "IntelliJ", "Postman", "Figma", "GitLab", "GitHub", "Linux", "Apple", "Google", "Android", "Arduino", "Chrome", "Firefox", "Slack", "Discord", "Trello", "Notion", "Obsidian", "Framer", "Sketch", "Blender", "Unity", "Unreal Engine"],
        "Social": ["X", "Twitter", "YouTube", "LinkedIn", "Instagram", "OpenAI", "Behance", "Medium", "Twitch", "TikTok", "Pinterest", "Reddit", "WhatsApp", "Telegram", "Facebook", "Snapchat", "Mastodon", "Patreon", "Substack", "Tumblr"]
    };

    // Helper to determine category
    const getCategory = (name: string) => {
        for (const [cat, items] of Object.entries(CATEGORIES)) {
            if (items.includes(name)) return cat;
        }
        return "Other";
    };

    // Group icons
    const groupedIcons: Record<string, typeof allIcons> = {};
    const usedIcons = new Set<string>();

    // Initialize groups in order
    Object.keys(CATEGORIES).concat("Other").forEach(cat => groupedIcons[cat] = []);

    allIcons.forEach(([name, path]) => {
        const cat = getCategory(name);
        groupedIcons[cat].push([name, path]);
        usedIcons.add(name);
    });

    // Remove empty groups
    Object.keys(groupedIcons).forEach(key => {
        if (groupedIcons[key].length === 0) delete groupedIcons[key];
    });

    return (
        <main className="flex min-h-screen flex-col items-center space-y-16 bg-[var(--background)] p-8 text-[var(--foreground)]">

            <header className="flex flex-col items-center gap-6 pt-12">
                <ArtodeTitle />
                <p className="font-mono text-xs tracking-widest text-[var(--secondary)] uppercase opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Swiss Minimalist Icon System // {allIcons.length} Glyphs
                </p>
            </header>

            <div className="w-full max-w-7xl flex flex-col gap-16 pb-24">
                {Object.entries(groupedIcons).map(([category, categoryIcons]) => (
                    <section key={category} className="flex flex-col gap-8">
                        <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--secondary)] border-b border-[var(--secondary)]/20 pb-2 w-full">
                            {category}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-12 gap-y-16">
                            {categoryIcons.sort((a, b) => a[0].localeCompare(b[0])).map(([name, path]) => (
                                <div key={name} className="flex flex-col items-center gap-4 group cursor-pointer">
                                    <ArtodeIcon
                                        path={path}
                                        size={40}
                                        drawType="fill"
                                        className="text-[var(--primary)] group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors opacity-60 group-hover:opacity-100 text-center max-w-[80px] truncate">
                                        {name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <footer className="absolute bottom-8 font-mono text-[10px] text-[var(--secondary)] opacity-50">
                © {new Date().getFullYear()} Artode Design // lucide-converted
            </footer>
        </main>
    );
}
