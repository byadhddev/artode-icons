"use client";

import { ArtodeIcon, type ArtodeIconProps } from "@/components/artode-icon";

const PATH = "M11.7 6.756l.72-3.324h3.18l-.72 3.324h2.532l-.72 3.324h-2.532l-1.356 6.252h-3.18l1.356-6.252H8.448l-.72 3.324h-3.18l.72-3.324H2.736l.72-3.324h2.532l1.356-6.252h3.18l-1.356 6.252h2.532zm-2.532 3.324l-1.356 6.252h2.532l1.356-6.252h-2.532z";

export const CIcon = ({ className, size, drawType = "fill", ...props }: Omit<ArtodeIconProps, "path" | "drawType"> & { drawType?: "fill" | "stroke" }) => {
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
