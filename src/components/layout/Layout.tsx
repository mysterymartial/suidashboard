import React, { useState } from "react";
import { Navbar } from "../navigation/Navbar";
import { Sidebar } from "../navigation/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 64 : 280;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar sidebarWidth={sidebarWidth} />

      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div
        className="transition-all duration-300 ease-in-out pt-16"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </div>
    </div>
  );
}
