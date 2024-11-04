"use client";

import React, { useEffect, useState } from "react";
import type { AppRoute } from "@/shared/server-routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { cn } from "../utils";

type PageLayoutProps = {
  route: AppRoute;
  buttons?: React.ReactNode;
  children: React.ReactNode;
};

export default function PageLayout({ route, buttons, children }: PageLayoutProps) {
  const pathname = usePathname();
  const subpathTitle = route.subRutas?.find((route) => route.href === pathname)?.label;
  const pathTitle = route.label;
  const [currentTitle, setCurrentTitle] = useState(pathTitle);

  useEffect(() => {
    if (!window) return;
    const updateTitle = () => setCurrentTitle(window.innerWidth < 1024 ? (subpathTitle ?? pathTitle) : pathTitle);
    updateTitle();
    window.addEventListener("resize", updateTitle);
    return () => window.removeEventListener("resize", updateTitle);
  }, [subpathTitle, pathTitle]);

  return (
    <>
      <header className="border-b border-slate-200">
        <div className="mx-auto flex flex-col justify-between px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
          <div className="flex flex-col items-start lg:flex-row lg:items-center">
            <h1 className="text-gray-90 truncate text-3xl font-bold tracking-tight lg:mr-8 lg:border-r lg:border-slate-200 lg:pr-8">
              {currentTitle}
            </h1>
            <Tabs defaultValue="" className="hidden space-x-8 rounded-lg bg-[#F1F5F9] p-2 text-sm lg:flex">
              <TabsList className="flex w-full flex-row gap-x-4">
                {route.subRutas?.map((subRuta) => (
                  <TabsTrigger
                    value={subRuta.href}
                    key={subRuta.href}
                    className={cn(
                      { " bg-[#FFFFFF]": subRuta.href === pathname },
                      "rounded-lg px-3 py-1.5 hover:bg-slate-200",
                    )}
                  >
                    <Link href={subRuta.href}>{subRuta.label}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          {buttons && <div className="mt-4 flex gap-x-2 p-2 lg:mt-0">{buttons}</div>}
        </div>
      </header>
      <div className="mx-auto w-full space-y-6 px-4 py-6 pb-10 sm:px-6 lg:px-8">{children}</div>
    </>
  );
}
