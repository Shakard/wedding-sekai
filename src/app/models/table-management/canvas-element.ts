import { User } from "../auth/user";
import { Catalogue } from "./catalogue";

export interface CanvasElement {
    id?: number;
    name?: string;
    code?: string;
    catalogue_id?: Catalogue;
    users?: User[];
    pos_x?:number;
    pos_y?:number;
}