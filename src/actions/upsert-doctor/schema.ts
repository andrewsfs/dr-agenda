import z from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório.",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória.",
    }),
    appointmentPriceInCents: z.number().min(1, {
      message: "Preço da consulta é obrigatório.",
    }),
    avaliableFromWeekDay: z.number().min(0).max(6),
    avaliableToWeekDay: z.number().min(0).max(6),
    avaliableFromTime: z.string().min(1, {
      message: "Hora de inicio é obrigatória.",
    }),
    avaliableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória.",
    }),
  })
  .refine(
    (data) => {
      return data.avaliableFromTime < data.avaliableToTime;
    },
    {
      message: "O horário de inicio não pode anterior ao horário de término",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
