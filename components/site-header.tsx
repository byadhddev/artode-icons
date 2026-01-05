import Link from "next/link";
import { Github, Heart } from "lucide-react";
import { LINK } from "@/constants";
import { cn } from "@/lib/utils";
import { ArtodeTitle } from "@/components/artode-title";
import { SponsorParticles } from "@/components/sponsor-particles";

async function getGitHubStars() {
    try {
        const response = await fetch("https://api.github.com/repos/adhdpaws/artode-icons", {
            next: { revalidate: 3600 }, // Cache for 1 hour
            headers: {
                "User-Agent": "Artode-Icons-Site"
            }
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.stargazers_count;
    } catch (error) {
        return null;
    }
}

export async function SiteHeader() {
    const stars = await getGitHubStars();

    return (
        <header className="w-full border-b border-secondary/10 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex h-14 items-center justify-between px-8">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <ArtodeTitle />
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/playground"
                        className="text-xs font-mono text-secondary hover:text-primary transition-colors mr-4"
                    >
                        Playground
                    </Link>
                    <SponsorParticles />

                    <div className="w-px h-4 bg-secondary/10" />

                    <Link
                        href={LINK.GITHUB}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-mono text-secondary hover:text-primary transition-colors bg-secondary/5 px-3 py-1.5 rounded-full border border-secondary/10 hover:border-primary/20"
                    >
                        <Github className="w-4 h-4" />
                        <span>Star on GitHub</span>
                        {stars !== null && (
                            <span className="bg-secondary/10 px-1.5 py-0.5 rounded text-[10px] ml-1">
                                {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(stars)}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
