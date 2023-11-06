import React from "react";

interface ShareButtonProps {
  ShareButtonComponent: React.ElementType;
  IconComponent: React.ElementType;
  url: string;
  text: string;
  bgColor?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  ShareButtonComponent,
  IconComponent,
  url,
  text,
  bgColor,
}) => (
  <ShareButtonComponent url={url}>
    <div
      className="flex items-center py-2 w-full rounded-full"
      style={{ backgroundColor: bgColor }}
    >
      <IconComponent size={40} round={false} className="rounded-xl ml-1 " />
      <span className="ml-2 text-lg">{text}</span>
    </div>
  </ShareButtonComponent>
);
