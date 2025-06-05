"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";

import { upsertPatient } from "@/actions/upsert-patient";
import {
  UpsertPatientSchema,
  upsertPatientSchema,
} from "@/actions/upsert-patient/schema";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientBiologicalSexEnum, patientsTable } from "@/db/schema";

interface UpsertPatientFormProps {
  patientToEdit?: typeof patientsTable.$inferSelect;
  onFormSuccess?: () => void;
  // Adicionado para controlar o estado de abertura do Dialog a partir do pai
  // e resetar o formulário quando o dialog é reaberto
  isOpen?: boolean;
}

export function UpsertPatientForm({
  patientToEdit,
  onFormSuccess,
  isOpen,
}: UpsertPatientFormProps) {
  const form = useForm<UpsertPatientSchema>({
    resolver: zodResolver(upsertPatientSchema),
    defaultValues: {
      id: patientToEdit?.id,
      name: patientToEdit?.name ?? "",
      email: patientToEdit?.email ?? "",
      phoneNumber: patientToEdit?.phoneNumber ?? "",
      biologicalSex: patientToEdit?.biologicalSex ?? undefined,
    },
  });

  const { execute, status } = useAction(upsertPatient, {
    onSuccess: (result) => {
      if (result.data?.success) {
        toast.success(result.data.message);
        form.reset();
        onFormSuccess?.();
      } else {
        toast.error(result.data?.message || "Erro ao salvar paciente.");
      }
    },
    onError: (errorInfo) => {
      toast.error(
        errorInfo.error.serverError || "Erro desconhecido ao salvar paciente.",
      );
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: patientToEdit?.id,
        name: patientToEdit?.name ?? "",
        email: patientToEdit?.email ?? "",
        phoneNumber: patientToEdit?.phoneNumber ?? "",
        biologicalSex: patientToEdit?.biologicalSex ?? undefined,
      });
    }
  }, [isOpen, patientToEdit, form]);

  function onSubmit(values: UpsertPatientSchema) {
    execute(values);
  }

  const isLoading = status === "executing";

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {patientToEdit ? "Editar Paciente" : "Adicionar Paciente"}
        </DialogTitle>
        <DialogDescription>
          {patientToEdit
            ? "Edite as informações do paciente abaixo."
            : "Preencha os dados para adicionar um novo paciente."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Paciente</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do Paciente"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Telefone</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    customInput={Input}
                    placeholder="(00) 00000-0000"
                    value={field.value}
                    onValueChange={(values) => field.onChange(values.value)} // Passa apenas o valor numérico
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="biologicalSex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patientBiologicalSexEnum.enumValues.map((sex) => (
                      <SelectItem key={sex} value={sex}>
                        {sex === "male" ? "Masculino" : "Feminino"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            {/* Adiciona DialogClosetai para o botão Cancelar, se necessário, ou remove se o controle é externo */}
            {/* <DialogClosetai asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClosetai> */}
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Salvando..."
                : patientToEdit
                  ? "Salvar Alterações"
                  : "Adicionar Paciente"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
