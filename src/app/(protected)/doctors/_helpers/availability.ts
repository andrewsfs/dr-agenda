import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { doctorsTable } from "@/db/schema";
dayjs.extend(utc);
dayjs.locale("pt-br");

export const getAvailability = (doctor: typeof doctorsTable.$inferSelect) => {
  const from = dayjs()
    .utc()
    .day(doctor.avaliableFromWeekDay)
    .set("hour", Number(doctor.avaliableFromTime.split(":")[0]))
    .set("minute", Number(doctor.avaliableFromTime.split(":")[1]))
    .set("second", Number(doctor.avaliableFromTime.split(":")[2] || 0))
    .local();
  const to = dayjs()
    .utc()
    .day(doctor.avaliableToWeekDay)
    .set("hour", Number(doctor.avaliableToTime.split(":")[0]))
    .set("minute", Number(doctor.avaliableToTime.split(":")[1]))
    .set("second", Number(doctor.avaliableToTime.split(":")[2] || 0))
    .local();
  return { from, to };
};
