import type { INominee as BaseINominee } from "../../../types";

export interface INominee extends Omit<BaseINominee, 'userId'> {
  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    country: string;
    address?: string;
  };
}

export interface NomineeListResponse {
  data: INominee[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
