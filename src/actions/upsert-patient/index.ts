"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertPatientSchema } from "./schema";

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Não autorizado. Faça login para continuar.");
    }
    if (!session?.user.clinic?.id) {
      // TODO: Melhorar essa checagem ou a forma de obter o clinicId
      // Idealmente, o usuário deveria selecionar uma clínica se tiver múltiplas,
      // ou uma clínica padrão deveria ser atribuída.
      // Por ora, se não houver clinicId na sessão, lançamos um erro.
      throw new Error(
        "Clínica não encontrada. Verifique as configurações da sua conta.",
      );
    }

    const clinicId = session.user.clinic.id;

    if (parsedInput.id) {
      // Update
      await db
        .update(patientsTable)
        .set({
          ...parsedInput,
          clinicId, // Garante que o clinicId não seja alterado para um paciente existente
          updatedAt: new Date(),
        })
        .where(eq(patientsTable.id, parsedInput.id));
    } else {
      // Insert
      await db.insert(patientsTable).values({
        ...parsedInput,
        id: crypto.randomUUID(), // Gera um novo UUID se não for um update
        clinicId,
      });
    }

    revalidatePath("/patients"); // Revalida a página de pacientes para mostrar os dados atualizados

    return {
      success: true,
      message: parsedInput.id
        ? "Paciente atualizado com sucesso!"
        : "Paciente adicionado com sucesso!",
    };
  });
