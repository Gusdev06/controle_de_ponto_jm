import { Either, left, right } from "@/core/either";
import { IUseCase } from "@/core/protocols/IUseCase";
import { EntityFinderService } from "@/domain/services/entity-finder-service";
import { ExtraTimeCalculationService } from "@/domain/services/extra-time-calculation";
import { WorkTimeCalculationService } from "@/domain/services/work-time-calculation-service";
import { Attendance } from "../entities/attendances";
import { NotFoundAttendanceError } from "../errors/Not-found-attendance-error";
import { NotFoundEmployeeError } from "../errors/Not-found-employee-error";
import { EmployeeNotHaveAJourney } from "../errors/employee-not-have-journey-error";
import { AttendanceRepository } from "../repositories/attendance-repository";

export interface IRegisterClockedOutAttendanceDTO {
    id: string;
    rfid: string;
    clockedOut: Date;
}

type RegistertClockedOutAttendanceUseCaseResponse = Either<
    NotFoundAttendanceError | NotFoundEmployeeError | EmployeeNotHaveAJourney,
    {
        attendance: Attendance;
    }
>;
export class RegisterClockedOutAttendanceUseCase
    implements
        IUseCase<
            IRegisterClockedOutAttendanceDTO,
            RegistertClockedOutAttendanceUseCaseResponse
        >
{
    constructor(
        private entityFinderService: EntityFinderService,
        private readonly calculaExtraTimeService: ExtraTimeCalculationService,
        private calculateWorkTimeService: WorkTimeCalculationService,
        private attendanceRepository: AttendanceRepository,
    ) {}

    async execute({
        id,
        rfid,
        clockedOut,
    }: IRegisterClockedOutAttendanceDTO): Promise<RegistertClockedOutAttendanceUseCaseResponse> {
        const result = await this.entityFinderService.findEntities(id, rfid);
        if (result.isLeft()) {
            return left(result.value);
        }

        const { attendance, journey } = result.value;

        const hoursWorked = this.calculateWorkTimeService.calculateWorkTime(
            attendance,
            clockedOut,
        );

        const extraTime = this.calculaExtraTimeService.calculateExtraTimeBefore(
            journey,
            attendance,
        );

        const extraTimeAfter =
            this.calculaExtraTimeService.calculateExtraTimeAfter(
                journey,
                clockedOut,
            );

        attendance.clockedOut = clockedOut;
        attendance.hoursWorked = hoursWorked;
        attendance.extraHours = extraTime + extraTimeAfter;

        await this.attendanceRepository.save(attendance);

        return right({ attendance });
    }
}

