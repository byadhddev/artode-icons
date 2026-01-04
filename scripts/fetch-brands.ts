import fs from "node:fs";
import path from "node:path";
import * as simpleIcons from "simple-icons";

// List of icons to fetch from Simple Icons
// Key: SimpleIcons name (slug or property name), Value: Our Display Name
// Simple Icons exports are often like simpleIcons.siGithub
const ICONS_TO_FETCH: Record<string, string> = {
    // Languages
    "go": "Go",
    "java": "Java",
    "php": "PHP",
    "ruby": "Ruby",
    "swift": "Swift",
    "kotlin": "Kotlin",
    "cplusplus": "C++",
    "csharp": "C#",

    // Frameworks
    "vuedotjs": "Vue.js",
    "svelte": "Svelte",
    "angular": "Angular",
    "astro": "Astro",
    "django": "Django",
    "laravel": "Laravel",
    "spring": "Spring",
    "flutter": "Flutter",
    "react": "React", // Updating existing to ensure consistency, or keeping custom? SimpleIcons has official.
    "nextdotjs": "Next.js", // Next.js

    // Databases
    "postgresql": "PostgreSQL",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "mysql": "MySQL",
    "supabase": "Supabase",
    "firebase": "Firebase",
    "graphql": "GraphQL",
    "sqlite": "SQLite",

    // DevOps/Cloud
    "amazonwebservices": "AWS",
    "microsoftazure": "Azure",
    "googlecloud": "GCP",
    "kubernetes": "Kubernetes",
    "docker": "Docker",

    // Tools
    "visualstudiocode": "VS Code",
    "git": "Git",
    "bun": "Bun",
    "pnpm": "PNPM",
    "npm": "npm",
    "intellijidea": "IntelliJ",
    "postman": "Postman",

    // Social/Platforms
    "discord": "Discord",
    "slack": "Slack",
    "youtube": "YouTube",
    "linkedin": "LinkedIn",
    "instagram": "Instagram",
    "openai": "OpenAI",

    // Existing ones to re-validate or just ensure we have
    "github": "GitHub",
    "typescript": "TypeScript",
    "javascript": "JavaScript",
    "nodedotjs": "Node.js",
    "python": "Python",
    "rust": "Rust",
    "vercel": "Vercel",
    "tailwindcss": "Tailwind",
    "apple": "Apple",
    "google": "Google",
    "linux": "Linux",
    "figma": "Figma",
    "gitlab": "GitLab",
    "x": "Twitter", // X / Twitter
};

// Ensure paths.json exists
const pathsPath = path.join(process.cwd(), "paths.json");
let paths: Record<string, string> = {};
if (fs.existsSync(pathsPath)) {
    paths = JSON.parse(fs.readFileSync(pathsPath, "utf8"));
}

// Helper to find the icon in simple-icons exports
// keys in simpleIcons object are like 'siGithub', 'siReact' etc.
// or we can use Get function if available, but direct access via 'si[PascalCase]' or iteration is safer.

let addedCount = 0;

Object.entries(ICONS_TO_FETCH).forEach(([slug, displayName]) => {
    // 1. Try to find by direct slug lookup if simple-icons exports a helper (usually they export individual objects)
    // The simple-icons package usually exports an object where keys are 'si' + PascalCaseSlug
    // But `simple-icons/icons` might be different. Let's try matching.

    // Convert slug to simple-icons export name format: 'si' + PascalCase
    // e.g. 'nextdotjs' -> 'Nextdotjs' -> 'siNextdotjs'
    // Actually simple-icons exports are usually normalized.
    // Let's iterate values to find matching slug.

    const icon = Object.values(simpleIcons).find((icon: any) => icon.slug === slug);

    if (icon && icon.path) {
        paths[displayName] = icon.path;
        addedCount++;
    } else {
        console.warn(`⚠️ Could not find icon for slug: ${slug} (${displayName})`);
    }
});

// Write back
fs.writeFileSync(pathsPath, JSON.stringify(paths, null, 2));
console.log(`\n✅ Updated paths.json with ${addedCount} brand paths.`);
