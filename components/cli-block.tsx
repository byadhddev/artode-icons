"use client";

import { ScrollArea as BaseScrollArea } from "@base-ui-components/react/scroll-area";
import { CopyIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { type IconStatus, IconState } from "@/components/ui/icon-state";

import { TextLoop } from "@/components/ui/text-loop";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";
import { PACKAGE_MANAGER } from "@/constants";
import { cn } from "@/lib/utils";
import { usePackageNameContext } from "@/components/providers/package-name";

const CliBlock = ({ className, icons }: { className?: string, icons?: string[] }) => {
    const [state, setState] = useState<IconStatus>("idle");
    const [_, startTransition] = useTransition();
    const currentIconName = useRef(icons?.[0] || "artode-icon");

    const { packageName, setPackageName } = usePackageNameContext();

    const handleCopyToClipboard = () => {
        startTransition(async () => {
            try {
                await navigator.clipboard.writeText(
                    `${getPackageManagerPrefix(packageName)} shadcn@latest add @artode-icons/${currentIconName.current}`
                );

                setState("done");
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setState("idle");
            } catch {
                toast.error("Failed to copy to clipboard", {
                    description: "Please check your browser permissions.",
                });
                setState("error");
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setState("idle");
            }
        });
    };

    return (
        <div
            className={cn("relative w-full max-w-[642px] px-4", className)}
        >
            {/* Tabs List */}
            <div className="w-full flex items-center justify-center gap-px">
                {Object.values(PACKAGE_MANAGER).map((pm) => (
                    <button
                        key={pm}
                        onClick={() => setPackageName(pm)}
                        className={cn(
                            "z-50 inline-flex cursor-pointer items-center justify-center whitespace-nowrap bg-secondary/5 px-4 py-1.5 font-mono text-xs text-secondary/60 hover:bg-secondary/10 hover:text-secondary",
                            "first:rounded-tl-md",
                            "transition-all duration-200 border-t border-r border-transparent border-l border-transparent",
                            packageName === pm && "bg-background text-primary border-secondary/10 z-10 font-medium shadow-sm -mb-px pb-2"
                        )}
                    >
                        {pm}
                    </button>
                ))}

                <button
                    aria-disabled={state !== "idle"}
                    aria-label="Copy to clipboard"
                    className={cn(
                        "z-50 inline-flex cursor-pointer items-center justify-center whitespace-nowrap bg-secondary/5 px-3 py-1.5 font-mono text-xs text-secondary/60 hover:bg-secondary/10 hover:text-primary",
                        "last:rounded-tr-md",
                        "transition-all duration-200 border-t border-r border-transparent border-l border-transparent"
                    )}
                    onClick={handleCopyToClipboard}
                    type="button"
                >
                    <IconState status={state}>
                        <CopyIcon aria-hidden="true" className="size-3.5" />
                    </IconState>
                </button>
            </div>

            {/* Content Area */}
            <div className="relative w-full overflow-hidden border border-secondary/10 rounded-b-md rounded-tr-md rounded-tl-md bg-secondary/5 p-0.5">
                <div className="relative w-full overflow-hidden rounded-[5px] bg-background">
                    <div className="flex items-center justify-center px-4 py-4 font-mono text-sm relative min-h-[52px]">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span aria-hidden="true" className="text-secondary/60 select-none">
                                {getPackageManagerPrefix(packageName)}
                            </span>
                            <div className="flex items-center gap-0">
                                <span className="text-secondary/80 select-none">
                                    shadcn@latest add @artode-icons/
                                </span>
                                {icons ? (
                                    <TextLoop
                                        interval={2}
                                        onIndexChange={(index) => {
                                            if (icons[index]) currentIconName.current = icons[index];
                                        }}
                                        className="text-primary font-medium"
                                    >
                                        {icons.map((icon) => (
                                            <span key={icon}>{icon}</span>
                                        ))}
                                    </TextLoop>
                                ) : (
                                    <span className="text-primary font-medium truncate">
                                        artode-icon
                                    </span>
                                )}
                            </div>
                            <a
                                href="https://www.npmjs.com/package/artode-icons"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sr-only"
                            >
                                View on NPM
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { CliBlock };
