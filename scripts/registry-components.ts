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
  }
];
