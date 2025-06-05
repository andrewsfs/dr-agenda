"use client";

import { Edit3Icon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { patientsTable } from "@/db/schema";

import { UpsertPatientForm } from "./upsert-patient-form"; // Importa o formulário de upsert

interface PatientCardProps {
  patient: typeof patientsTable.$inferSelect;
}

export function PatientCard({ patient }: PatientCardProps) {
  const [isUpsertPatientDialogOpen, setIsUpsertPatientDialogOpen] =
    useState(false);

  const patientInitials = patient.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const biologicalSexLabel =
    patient.biologicalSex === "male" ? "Masculino" : "Feminino";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {/* Idealmente, aqui viria uma imagem do paciente, se disponível */}
            {/* <AvatarImage src={patient.avatarUrl} alt={patient.name} /> */}
            <AvatarFallback>{patientInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg leading-tight font-semibold">
              {patient.name}
            </h3>
            {/* Poderíamos adicionar um subtítulo aqui, como data de nascimento ou algo relevante */}
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 pt-4">
        <div className="text-muted-foreground flex items-center text-sm">
          <MailIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>{patient.email}</span>
        </div>
        <div className="text-muted-foreground flex items-center text-sm">
          <PhoneIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>{patient.phoneNumber}</span>
        </div>
        <div className="text-muted-foreground flex items-center text-sm">
          <UserIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>{biologicalSexLabel}</span>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Dialog
          open={isUpsertPatientDialogOpen}
          onOpenChange={setIsUpsertPatientDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Edit3Icon className="mr-2 h-4 w-4" />
              Ver Detalhes / Editar
            </Button>
          </DialogTrigger>
          {/* 
            Passamos o paciente para edição e a função para fechar o dialog.
            isOpen é passado para que o formulário possa resetar quando aberto.
           */}
          {isUpsertPatientDialogOpen && (
            <UpsertPatientForm
              patientToEdit={patient}
              onFormSuccess={() => setIsUpsertPatientDialogOpen(false)}
              isOpen={isUpsertPatientDialogOpen}
            />
          )}
        </Dialog>
      </CardFooter>
    </Card>
  );
}
