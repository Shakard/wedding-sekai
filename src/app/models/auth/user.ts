import { Chair } from "../table-management/chair";
import { TableGuest } from "../table-management/table-guest";

export interface User {
    /*id?: number;
    first_name?: string;
    last_name?: string;
    identification?: string;   
    phone?: string;
    email?: string;
    password?: string;
    picture?: File;*/
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    chair?: Chair;
    table?: TableGuest;
    roles?: string;

}