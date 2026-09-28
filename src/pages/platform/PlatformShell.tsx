import React, { ReactNode } from "react";
import Shell from "../components/Shell";

interface PlatformShellProps {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  children: ReactNode;
}

export default function PlatformShell({ eyebrow, title, lede, children }: PlatformShellProps) {
  return (
    <Shell>
      <div className="cc-page-head">
        {eyebrow && <span className="cc-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {lede && <p className="cc-lede">{lede}</p>}
      </div>
      {children}
    </Shell>
  );
}
