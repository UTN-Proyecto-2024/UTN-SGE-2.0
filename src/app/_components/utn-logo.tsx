"use client";

import { cn } from "@/components/utils";
import Image from "next/image";

export const UTNLogo = ({ className }: { className?: string }) => (
  <Image
    src={"/utn-logo.svg"}
    alt={"Logo UTN"}
    className={cn("h-9 w-auto", className)}
    width={32}
    height={32}
    color="white"
  />
);
