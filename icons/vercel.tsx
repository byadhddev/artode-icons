"use client";

import { ArtodeIcon, type ArtodeIconProps } from "@/components/artode-icon";

const PATH = "m12 1.608 12 20.784H0Z";

export const VercelIcon = ({ className, size, ...props }: Omit<ArtodeIconProps, "path">) => {
  return (
    <ArtodeIcon
      path={PATH}
      className={className}
      size={size}
      {...props}
    />
  );
};
