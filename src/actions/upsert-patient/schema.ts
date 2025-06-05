import { z } from "zod";

import { patientBiologicalSexEnum } from "@/db/schema";

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(), // Para permitir o upsert (update se ID existir)
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  phoneNumber: z.string().min(10, "Número de telefone inválido."), // Validação mais específica pode ser feita no frontend com a máscara
  biologicalSex: z.enum(patientBiologicalSexEnum.enumValues),
  // clinicId será adicionado na action a partir do usuário logado/contexto
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
