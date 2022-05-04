import { CanvasElement } from "../table-management/canvas-element";
import { Chair } from "../table-management/chair";
import { TableGuest } from "../table-management/table-guest";
import { Role } from "./role";

export interface User {
    id?: number;
    first_name?: string;
    last_name?: string;
    confirmation?:boolean;
    email?: string;
    password?: string;
    password_confirmation?: string;
    chair?: Chair;
    table?: TableGuest;
    roles?: Role;
    canvas_element?: CanvasElement;

}