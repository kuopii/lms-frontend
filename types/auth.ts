export enum Role {
  TEACHER = "teacher",
  STUDENT = "student",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
};
