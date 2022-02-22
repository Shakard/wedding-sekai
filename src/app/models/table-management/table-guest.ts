import { User } from "../auth/user";

export interface TableGuest {
    id?: number;
    name?: string;
    code?: string;
    users?: User[];
}