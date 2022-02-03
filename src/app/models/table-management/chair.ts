import { User } from "../auth/user";
import { TableGuest } from "./table-guest";

export interface Chair {
    id?: number;
    table?: TableGuest;
    user?: User;
    name?:string;
    code?:string; 
}