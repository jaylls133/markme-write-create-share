
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Editor", path: "/editor" },
    { name: "My Pages", path: "/my-pages" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <header className="bg-background sticky top-0 z-10 w-full border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MarkMe
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center ml-6 space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          <div className="block md:hidden">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
