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

export const LinuxLogo = ({ className }: { className?: string }) => (
  <Image
    src={"/linux-logo.svg"}
    alt={"Logo Linux"}
    className={cn("h-9 w-auto", className)}
    width={32}
    height={32}
    color="white"
  />
);

export const WindowsLogo = ({ className }: { className?: string }) => (
  <Image
    src={"/windows-logo.svg"}
    alt={"Logo Windows"}
    className={cn("h-9 w-auto", className)}
    width={32}
    height={32}
    color="white"
  />
);

export const UTN_BASE_64_CODE =
  "PHN2ZwogICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgaW1hZ2VSZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIKICAgIHNoYXBlUmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iCiAgICB0ZXh0UmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iCiAgICB2aWV3Qm94PSIwIDAgNTk1LjMgNjk5LjQiCj4KICAgIDxwYXRoCiAgICBmaWxsUnVsZT0iZXZlbm9kZCIKICAgIGQ9Ik0yNDYuNiAwaDEwMnYxOTAuOEM0MjkuNCAxNjguNCA0ODkgOTQuMSA0ODkgNi40aDEwNi4zYzAgMTQ2LjUtMTA2LjggMjY4LjktMjQ2LjYgMjkzLjJ2NC40aDIzMy45djEwNC4ySDM2OC4yYzEzMCAzMS44IDIyNyAxNDkuNSAyMjcgMjg5LjFINDg5YzAtODcuNy01OS42LTE2Mi0xNDAuMy0xODQuNHYxODYuNWgtMTAyVjUxMi45Yy04MC43IDIyLjQtMTQwLjMgOTYuNy0xNDAuMyAxODQuNEgwQzAgNTU3LjcgOTcgNDQwIDIyNyA0MDguMkgxMi44VjMwNGgyMzMuOXYtNC40QzEwNi44IDI3NS4zIDAgMTUyLjkgMCA2LjRoMTA2LjNjMCA4Ny43IDU5LjYgMTYyIDE0MC4zIDE4NC40eiIKICAgIGNsaXBSdWxlPSJldmVub2RkIgogICAgLz4KPC9zdmc+Cg==";

export const UTN_BASE_64_IMG_EMAIL_SRC = `data:image/svg+xml;base64,${UTN_BASE_64_CODE}`;
