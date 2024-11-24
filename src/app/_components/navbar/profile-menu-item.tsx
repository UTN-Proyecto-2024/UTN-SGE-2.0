import { MenuItem } from "@headlessui/react";

export const ProfileMenuItem = ({ key, href, label }: { key: string; href: string; label: string }) => (
  <MenuItem key={key}>
    <a href={href} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-slate-100">
      {label}
    </a>
  </MenuItem>
);
