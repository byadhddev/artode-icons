"use client";

import { ArtodeIcon, type ArtodeIconProps } from "@/components/artode-icon";

const PATH = "M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z";

export const VuejsIcon = ({ className, size, drawType = "fill", ...props }: Omit<ArtodeIconProps, "path" | "drawType"> & { drawType?: "fill" | "stroke" }) => {
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
