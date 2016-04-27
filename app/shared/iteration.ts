import {Declinaison} from "./declinaison";
export interface Iteration {
    annee: string;
    declinaisons: Declinaison[];
    ferme: boolean;
    id: string;
    iteration: number;
}