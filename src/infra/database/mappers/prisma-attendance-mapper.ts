import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Attendance } from "@/domain/attendances/entities/attendances";

import { Prisma, Attendance as PrismaAttendance } from "@prisma/client";

export class PrismaAttendanceMapper {
    static toDomain(raw: PrismaAttendance): Attendance {
        return Attendance.create(
            {
                rfid: raw.rfId,
                date: raw.date,
                clockedIn: raw.clockedIn,
                lunchStart: raw.lunchStart ?? undefined,
                lunchEnd: raw.lunchEnd ?? undefined,
                clockedOut: raw.clockedOut ?? undefined,
                delay: raw.delay,
                employeeId: raw.employeeId,
                extraHours: raw.extraHours,
                hoursWorked: raw.hoursWorked,
            },
            new UniqueEntityID(raw.id),
        );
    }

    static toPrisma(
        attendance: Attendance,
    ): Prisma.AttendanceUncheckedCreateInput {
        return {
            id: attendance.id.toString(),
            rfId: attendance.rfid,
            date: attendance.date,
            clockedIn: attendance.clockedIn,
            lunchStart: attendance.lunchStart ?? undefined,
            lunchEnd: attendance.lunchEnd ?? undefined,
            clockedOut: attendance.clockedOut ?? undefined,
            delay: attendance.delay,
            extraHours: attendance.extraHours,
            hoursWorked: attendance.hoursWorked,
            employeeId: attendance.employeeId,
            createdAt: new Date(),
        };
    }
}

