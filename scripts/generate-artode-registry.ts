import fs from "node:fs";
import path from "node:path";

// Read paths.json
const pathsPath = path.join(process.cwd(), "paths.json");
const paths = JSON.parse(fs.readFileSync(pathsPath, "utf8"));

// Ensure icons directory exists
const iconsDir = path.join(process.cwd(), "icons");
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Registry components list
const registryComponents = [];

// 1. Add ArtodeIcon base component
registryComponents.push({
    name: "artode-icon",
    path: 'path.join(__dirname, "../components/artode-icon.tsx")',
    registryDependencies: [],
    dependencies: [],
    type: "registry:ui"
});

// 2. Generate Icon Files and Registry Entries
Object.entries(paths).forEach(([name, d]) => {
    // Convert name to kebab-case for filename (e.g. Next.js -> next-js)
    const fileName = name.toLowerCase().replace(/\./g, "-").replace(/\s+/g, "-");
    const componentName = name.replace(/\./g, "").replace(/\s+/g, "") + "Icon";

    // Create component content
    const content = `"use client";

import { ArtodeIcon, type ArtodeIconProps } from "@/components/artode-icon";

const PATH = "${d}";

export const ${componentName} = ({ className, size, ...props }: Omit<ArtodeIconProps, "path">) => {
  return (
    <ArtodeIcon
      path={PATH}
      className={className}
      size={size}
      {...props}
    />
  );
};
`;

    fs.writeFileSync(path.join(iconsDir, `${fileName}.tsx`), content);

    // Add to registry list
    registryComponents.push({
        name: fileName,
        path: `path.join(__dirname, "../icons/${fileName}.tsx")`,
        registryDependencies: ["artode-icon"],
        dependencies: [],
        type: "registry:ui"
    });
});

// 3. Generate registry-components.ts
const registryContent = `import path from "node:path";
import type { Schema } from "./registry-schema";

type ComponentDefinition = Partial<Schema> & {
  name: string;
  path: string;
};

export const components: ComponentDefinition[] = [
${registryComponents.map(c => `  {
    name: "${c.name}",
    path: ${c.path},
    registryDependencies: ${JSON.stringify(c.registryDependencies)},
    dependencies: ${JSON.stringify(c.dependencies)},
    type: "${c.type}"
  }`).join(",\n")}
];
`;

fs.writeFileSync(path.join(process.cwd(), "scripts/registry-components.ts"), registryContent);

console.log(`Generated ${registryComponents.length} registry entries.`);
