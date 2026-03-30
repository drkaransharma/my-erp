export type EmployeeStatus = "ACTIVE" | "ON_LEAVE" | "TERMINATED";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "LEAVE";
export type LeaveType = "ANNUAL" | "SICK" | "PERSONAL" | "UNPAID";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PayrollStatus = "DRAFT" | "PROCESSED" | "PAID";

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  position: string;
  departmentId: string | null;
  managerId: string | null;
  status: EmployeeStatus;
  joinDate: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string };
  manager?: { id: string; firstName: string; lastName: string };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: number | null;
  status: AttendanceStatus;
  employee?: Employee;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string | null;
  status: LeaveStatus;
  approvedById: string | null;
  employee?: Employee;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
  employee?: Employee;
}
