import React from "react";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  subtitle,
  align = "center",
  className = "",
  as = "h2",
}) => {
  const alignment = align === "left" ? "text-left" : "text-center";
  const dividerAlignment = align === "left" ? "mr-auto" : "mx-auto";
  const Heading = as;

  return (
    <div className={`${alignment} ${className}`}>
      {label && (
        <span className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-4 block">
          {label}
        </span>
      )}
      <Heading className="font-serif text-4xl md:text-5xl text-brand-text-primary mb-4">
        {title}
      </Heading>
      {subtitle && (
        <p className="text-brand-text-secondary text-base md:text-lg font-light max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div
        className={`h-px w-24 bg-brand-accent ${dividerAlignment} mt-6`}
      ></div>
    </div>
  );
};
