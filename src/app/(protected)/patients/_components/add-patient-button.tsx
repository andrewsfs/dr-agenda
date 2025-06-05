"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { UpsertPatientForm } from "./upsert-patient-form";

export function AddPatientButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </DialogTrigger>
      {isOpen && (
        <UpsertPatientForm
          onFormSuccess={() => setIsOpen(false)}
          isOpen={isOpen}
        />
      )}
    </Dialog>
  );
}
