"use client";

import { Button } from "@/components/ui";
import { HandHelping, Handshake, RotateCw } from "lucide-react";

export const PrestarButton = () => {
  return (
    <Button title="Prestar" variant="default" color="primary" size="sm" className="min-w-32 border-none bg-[#0E22F1]">
      <div className="flex flex-row gap-x-2 text-[#F3F4FE]">
        <HandHelping size={16} className="ml-2" />
        Prestar
      </div>
    </Button>
  );
};

export const DevolverButton = () => {
  return (
    <Button title="Prestar" variant="default" color="primary" size="sm" className="min-w-32 border-none bg-[#F3F4FE]">
      <div className="flex flex-row gap-x-2 text-[#0E22F1]">
        <Handshake size={16} className="ml-2" />
        Devolver
      </div>
    </Button>
  );
};

export const RenovarButton = () => {
  return (
    <Button title="Renovar" variant="default" color="primary" size="sm" className="min-w-32 border-none bg-[#0E22F1]">
      <div className="flex flex-row gap-x-2 text-[#F3F4FE]">
        <RotateCw size={16} className="ml-2" />
        Renovar
      </div>
    </Button>
  );
};
