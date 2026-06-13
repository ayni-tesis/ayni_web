/**
 * Contrato compartido con el backend (microservicio user-service).
 * Los nombres/forma de estos tipos deben coincidir con los DTOs del backend
 * cuando se exponga el endpoint admin GET /api/users.
 */

export type UserRole = "FARMER" | "AGRONOMIST" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  community: string;
  lastActivityAt: string;
  status: UserStatus;
  avatarUrl: string | null;
};

export type ListUsersParams = {
  page?: number;
  size?: number;
  search?: string;
  role?: UserRole | "ALL";
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ApiError = {
  status: number;
  message: string;
  path?: string;
};

// ────────────────────────────────────────────────────────────
// Plagues (microservicio diagnosis-service · catálogo de plagas)
// ────────────────────────────────────────────────────────────

export type Severity = "CRITICAL" | "HIGH_RISK" | "MODERATE" | "LOW";

export type PlagueTagKind =
  | "FUNGUS"
  | "INSECT"
  | "BACTERIA"
  | "LEAVES"
  | "CHERRY"
  | "ROOTS"
  | "STEM";

export type Plague = {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  severity: Severity;
  tags: PlagueTagKind[];
  imageUrl: string | null;
  estimatedLossPercent: number;
  createdAt: string;
  updatedAt: string;
};

export type ListPlaguesParams = {
  page?: number;
  size?: number;
  search?: string;
  severities?: Severity[];
};
