import React from "react";

export interface NavItem {
  label: string;
  path: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  items: string[];
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

export interface LocationItem {
  name: string;
  address: string;
  phone?: string;
  type: "headquarters" | "store";
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  // Portable Text blocks from Sanity or array of paragraphs
  content?: any[];
  imageUrl?: string;
  date?: string;
  author?: string;
  category?: string;
  tags?: string[];
}
