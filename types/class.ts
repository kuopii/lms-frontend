import { Role, User } from "./auth";

export enum ModuleType {
  Listening = "listening",
  Speaking = "speaking",
  Reading = "reading",
  Writing = "writing",
}

export type Teacher = User & {
  role: Role.TEACHER;
  bio: string;
};

export type Student = User & {
  role: Role.STUDENT;
};

export type Class = {
  id: string;
  teacher_id: string;
  name: string;
  description: string;
  class_code: string;
  cover_image: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  teacher: Teacher;
  students: Student[];
};

export type Enrollment = {
  id: string;
  class_id: string;
  student_id: string;
  status: "active" | "inactive";
  enrolled_at: Date;
  created_at: string;
  updated_at: string;
  class: Class;
  student: Student;
};
