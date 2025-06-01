"use server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertDoctorSchema } from "./schema";

dayjs.extend(utc);

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const avaliableFromTime = parsedInput.avaliableFromTime;
    const avaliableToTime = parsedInput.avaliableToTime;

    const avaliableFromTimeUTC = dayjs()
      .set("hour", parseInt(avaliableFromTime.split(":")[0]))
      .set("minute", parseInt(avaliableFromTime.split(":")[1]))
      .set("second", parseInt(avaliableFromTime.split(":")[2]))
      .utc();

    const avaliableToTimeUTC = dayjs()
      .set("hour", parseInt(avaliableToTime.split(":")[0]))
      .set("minute", parseInt(avaliableToTime.split(":")[1]))
      .set("second", parseInt(avaliableToTime.split(":")[2]))
      .utc();

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthozired");
    }
    if (!session?.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    await db
      .insert(doctorsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
        clinicId: session?.user.clinic?.id,
        avaliableFromTime: avaliableFromTimeUTC.format("HH:mm:ss"),
        avaliableToTime: avaliableToTimeUTC.format("HH:mm:ss"),
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
          avaliableFromTime: avaliableFromTimeUTC.format("HH:mm:ss"),
          avaliableToTime: avaliableToTimeUTC.format("HH:mm:ss"),
        },
      });
    revalidatePath("/doctors");
  });
