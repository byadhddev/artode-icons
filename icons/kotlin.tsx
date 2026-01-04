"use client";

import { ArtodeIcon, type ArtodeIconProps } from "@/components/artode-icon";

const PATH = "M24 24H0V0h24L12 12Z";

export const KotlinIcon = ({ className, size, drawType = "fill", ...props }: Omit<ArtodeIconProps, "path" | "drawType"> & { drawType?: "fill" | "stroke" }) => {
  return (
    <ArtodeIcon
      path={PATH}
      className={className}
      size={size}
      drawType={drawType}
      {...props}
    />
  );
};
