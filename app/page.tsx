import { ArtodeIcon } from "@/components/artode-icon";
import { ArtodeTitle } from "@/components/artode-title";
import paths from "@/paths.json";

export default function Home() {
    const icons = Object.entries(paths);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center space-y-16 bg-[var(--background)] p-24 text-[var(--foreground)]">

            <header className="flex flex-col items-center gap-6">
                <ArtodeTitle />
                <p className="font-mono text-sm tracking-widest text-[var(--secondary)] uppercase opacity-80">
                    Swiss Minimalist Icon System
                </p>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-12 pb-24">
                {icons.sort((a, b) => a[0].localeCompare(b[0])).map(([name, path]) => (
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

            <footer className="absolute bottom-8 font-mono text-[10px] text-[var(--secondary)] opacity-50">
                © {new Date().getFullYear()} Artode Design // lucide-converted
            </footer>
        </main>
    );
}
