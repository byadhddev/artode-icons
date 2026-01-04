"use client";

import { ArtodeIcon, type ArtodeIconProps } from "@/components/artode-icon";

const PATH = "M5.72 17.58L10.98 4h3.69l-4.58 13.6L5.72 17.6zm8.8 1.48l1.68-4.32 7.37 5.25H14.52z";

export const AzureIcon = ({ className, size, drawType = "fill", ...props }: Omit<ArtodeIconProps, "path" | "drawType"> & { drawType?: "fill" | "stroke" }) => {
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
