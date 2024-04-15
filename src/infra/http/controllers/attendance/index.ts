import { OffsetGenerator } from "@/core/pagination/adapters/implementations/Offset";
import { TotalPagesGenerator } from "@/core/pagination/adapters/implementations/TotalPagesGenerator";
import { DayjsDateProvider } from "@/domain/attendances/providers/implementations/DayJsProvider";
import { DeleteLunchStartAtUseCase } from "@/domain/attendances/use-cases/delete-lunch-start";
import { ListAttendanceUseCase } from "@/domain/attendances/use-cases/fetch-attendances";
import { RegisterFirstTimeInAttendanceUseCase } from "@/domain/attendances/use-cases/rfid-register-first-time";
import { RegisterLunchStartAttendanceUseCase } from "@/domain/attendances/use-cases/rfid-register-lunch-start";
import { RegisterClockedOutAttendanceUseCase } from "@/domain/attendances/use-cases/rifd-register-clocked-out";
import { RegisterLunchEndAttendanceUseCase } from "@/domain/attendances/use-cases/rifd-register-lunch-end";
import { DelayCalculationService } from "@/domain/services/delay-calculation-service";
import { EntityFinderService } from "@/domain/services/entity-finder-service";
import { ExtraTimeCalculationService } from "@/domain/services/extra-time-calculation";
import { WorkTimeCalculationService } from "@/domain/services/work-time-calculation-service";
import { AttendancePrismaRepository } from "@/infra/database/repositories/prisma-attendance-repository";
import { EmployeePrismaRepository } from "@/infra/database/repositories/prisma-employee-repository";
import { JourneyPrismaRepository } from "@/infra/database/repositories/prisma-journey-repository";
import { EditFirstTimeUseCase } from "./../../../../domain/attendances/use-cases/edit-firts-time";
import { RegisterClockedInAttendanceController } from "./create-attendance-controller";
import { DeleteLunchStartController } from "./delete-lunch-start-controller";
import { EditFirstTimeController } from "./edit-first-time-controller";
import { ListAttendanceController } from "./fetch-attendances-controller";
import { DeleteClockedOutUseCase } from "@/domain/attendances/use-cases/delete-clocked-out";
import { DeleteClockedOutController } from "./delete-clocked-out-controller";
import { DeleteLunchEndAtUseCase } from "@/domain/attendances/use-cases/delete-lunch-end";
import { DeleteLunchEndController } from "./delete-lunch-end-controller";
import { PaidAttendanceController } from "./paid-attendance-controller";
import { PaidAttendanceUseCase } from "@/domain/attendances/use-cases/paid-attendance";
import { RegisterClockedOutAttendanceController } from "./register-clocked-out-attendance-controller";
import { RegisterLunchEndAttendanceController } from "./register-lunch-end-attendance-controller";
import { RegisterLunchStartAttendanceController } from "./register-lunch-start-attendance-controller";
import { PdfService } from "@/domain/services/pdfservice";
import { GenerateReportController } from "./generate-report-controller";
import { HolidayPrismaRepository } from "@/infra/database/repositories/prisma-holiday-repository";
import { GenerateReportUseCase } from "@/domain/attendances/use-cases/generate-report";
import { HtmlPdfGenerator } from "../../../application/pdf-generator";
import { GeneratePdfUseCase } from "@/domain/attendances/use-cases/generate-pdf-use-case";
import { GeneratePdfController } from "./generate-pdf-controller";
import e from "cors";
const offsetGenerator = new OffsetGenerator();
const totalPagesGenerator = new TotalPagesGenerator();
const journeyRepository = new JourneyPrismaRepository();
const holidayRepository = new HolidayPrismaRepository();
const employeeRepository = new EmployeePrismaRepository();
const dayjsProvider = new DayjsDateProvider();
const calculaExtraTimeService = new ExtraTimeCalculationService(dayjsProvider);
const attendanceRepository = new AttendancePrismaRepository();
const calculateWorkTimeService = new WorkTimeCalculationService(dayjsProvider);
const delayCalculationService = new DelayCalculationService(dayjsProvider);
const entityFinderService = new EntityFinderService(
    attendanceRepository,
    employeeRepository,
    journeyRepository,
);
const generateReportUseCase = new GenerateReportUseCase(employeeRepository,attendanceRepository,holidayRepository)
const generateReportController = new GenerateReportController(generateReportUseCase)

const pdfGenerator = new HtmlPdfGenerator();
const pdfService = new PdfService(pdfGenerator);
const generatePdfuseCase = new GeneratePdfUseCase(pdfService,
    generateReportUseCase,
);
const generatePdfController = new GeneratePdfController(generatePdfuseCase);
const deleteLunchStartUseCase = new DeleteLunchStartAtUseCase(
    attendanceRepository,
);

const deletelunchendUsecase = new DeleteLunchEndAtUseCase(attendanceRepository);
const deleteLunchEndController = new DeleteLunchEndController(deletelunchendUsecase);


const deleteClockedOutUseCase = new DeleteClockedOutUseCase(
    attendanceRepository,
);

const deleteClockedOutController = new DeleteClockedOutController(
    deleteClockedOutUseCase,
);

const deleteLunchStartController = new DeleteLunchStartController(
    deleteLunchStartUseCase,
);

const listAttendanceUseCase = new ListAttendanceUseCase(
    attendanceRepository,
    offsetGenerator,
    totalPagesGenerator,
);

const paidAttendanceUseCase = new PaidAttendanceUseCase(
    attendanceRepository,
    entityFinderService
)

const paidAttendanceController = new PaidAttendanceController(
    paidAttendanceUseCase)

const listAttendanceController = new ListAttendanceController(
    listAttendanceUseCase,
);

const registerFirstTimeInAttendanceUseCase =
    new RegisterFirstTimeInAttendanceUseCase(
        attendanceRepository,
        delayCalculationService,
        calculaExtraTimeService,
        dayjsProvider,
        calculateWorkTimeService,
        entityFinderService,
    );

const registerClockedInAttendanceController =
    new RegisterClockedInAttendanceController(
        registerFirstTimeInAttendanceUseCase,
    );

const editFirstTimeUseCase = new EditFirstTimeUseCase(
    attendanceRepository,
    entityFinderService,
    delayCalculationService,
    calculaExtraTimeService,
    calculateWorkTimeService,
);
const editFirstTimeController = new EditFirstTimeController(
    editFirstTimeUseCase,
);
const registerLunchStartAttendanceUseCase =
    new RegisterLunchStartAttendanceUseCase(
        attendanceRepository,
        delayCalculationService,
        calculateWorkTimeService,
        dayjsProvider,
        entityFinderService,
    );
const registerLunchStartAttendanceController =
    new RegisterLunchStartAttendanceController(
        registerLunchStartAttendanceUseCase,
    );

const registerLunchEndAttendanceUseCase = new RegisterLunchEndAttendanceUseCase(
    entityFinderService,
    delayCalculationService,
    calculateWorkTimeService,
    attendanceRepository,
);
const registerLunchEndAttendanceController =
    new RegisterLunchEndAttendanceController(registerLunchEndAttendanceUseCase);

const registerClockedOutAttendanceUseCase =
    new RegisterClockedOutAttendanceUseCase(
        entityFinderService,
        calculaExtraTimeService,
        calculateWorkTimeService,
        attendanceRepository,
    );

const registerClockedOutAttendanceController =
    new RegisterClockedOutAttendanceController(
        registerClockedOutAttendanceUseCase,
    );

export {
    deleteLunchStartController,
    editFirstTimeController,
    listAttendanceController,
    registerClockedInAttendanceController,
    registerClockedOutAttendanceController,
    registerLunchEndAttendanceController,
    registerLunchStartAttendanceController,
    generatePdfController,
    generateReportController,
    paidAttendanceController,
    deleteLunchEndController,
    deleteClockedOutController
};

// Path: src/infra/http/routes/attendance-routes.ts

