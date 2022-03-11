import { CanvasElement } from "./canvas-element";

export interface Catalogue {
    id?: number;
    name?: string;
    type?: string;
    canvas_elements?: CanvasElement[];
}