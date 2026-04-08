import type { Role } from "@/app-types";

export type AuthProfile = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  interests: string[];
};

