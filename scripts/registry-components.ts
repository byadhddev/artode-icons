import path from "node:path";
import type { Schema } from "./registry-schema";

type ComponentDefinition = Partial<Schema> & {
  name: string;
  path: string;
};

export const components: ComponentDefinition[] = [
  {
    name: "artode-icon",
    path: path.join(__dirname, "../components/artode-icon.tsx"),
    registryDependencies: [],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "github",
    path: path.join(__dirname, "../icons/github.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "react",
    path: path.join(__dirname, "../icons/react.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "next-js",
    path: path.join(__dirname, "../icons/next-js.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "typescript",
    path: path.join(__dirname, "../icons/typescript.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "javascript",
    path: path.join(__dirname, "../icons/javascript.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "node-js",
    path: path.join(__dirname, "../icons/node-js.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "python",
    path: path.join(__dirname, "../icons/python.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "rust",
    path: path.join(__dirname, "../icons/rust.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "docker",
    path: path.join(__dirname, "../icons/docker.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "vercel",
    path: path.join(__dirname, "../icons/vercel.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "tailwind",
    path: path.join(__dirname, "../icons/tailwind.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "apple",
    path: path.join(__dirname, "../icons/apple.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "google",
    path: path.join(__dirname, "../icons/google.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "linux",
    path: path.join(__dirname, "../icons/linux.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "figma",
    path: path.join(__dirname, "../icons/figma.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "gitlab",
    path: path.join(__dirname, "../icons/gitlab.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "twitter",
    path: path.join(__dirname, "../icons/twitter.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "go",
    path: path.join(__dirname, "../icons/go.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "php",
    path: path.join(__dirname, "../icons/php.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "ruby",
    path: path.join(__dirname, "../icons/ruby.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "swift",
    path: path.join(__dirname, "../icons/swift.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "kotlin",
    path: path.join(__dirname, "../icons/kotlin.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "cplusplus",
    path: path.join(__dirname, "../icons/cplusplus.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "vue-js",
    path: path.join(__dirname, "../icons/vue-js.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "svelte",
    path: path.join(__dirname, "../icons/svelte.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "angular",
    path: path.join(__dirname, "../icons/angular.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "astro",
    path: path.join(__dirname, "../icons/astro.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "django",
    path: path.join(__dirname, "../icons/django.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "laravel",
    path: path.join(__dirname, "../icons/laravel.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "spring",
    path: path.join(__dirname, "../icons/spring.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "flutter",
    path: path.join(__dirname, "../icons/flutter.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "postgresql",
    path: path.join(__dirname, "../icons/postgresql.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "mongodb",
    path: path.join(__dirname, "../icons/mongodb.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "redis",
    path: path.join(__dirname, "../icons/redis.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "mysql",
    path: path.join(__dirname, "../icons/mysql.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "supabase",
    path: path.join(__dirname, "../icons/supabase.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "firebase",
    path: path.join(__dirname, "../icons/firebase.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "graphql",
    path: path.join(__dirname, "../icons/graphql.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "sqlite",
    path: path.join(__dirname, "../icons/sqlite.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "gcp",
    path: path.join(__dirname, "../icons/gcp.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "kubernetes",
    path: path.join(__dirname, "../icons/kubernetes.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "git",
    path: path.join(__dirname, "../icons/git.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "bun",
    path: path.join(__dirname, "../icons/bun.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "pnpm",
    path: path.join(__dirname, "../icons/pnpm.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "npm",
    path: path.join(__dirname, "../icons/npm.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "intellij",
    path: path.join(__dirname, "../icons/intellij.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "postman",
    path: path.join(__dirname, "../icons/postman.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "discord",
    path: path.join(__dirname, "../icons/discord.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "youtube",
    path: path.join(__dirname, "../icons/youtube.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  },
  {
    name: "instagram",
    path: path.join(__dirname, "../icons/instagram.tsx"),
    registryDependencies: ["artode-icon"],
    dependencies: [],
    type: "registry:ui"
  }
];
