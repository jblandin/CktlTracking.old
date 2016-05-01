import {Groupe} from "./groupe";
/**
 * Created by Julien on 02/05/2016.
 */
export interface Utilisateur {
    id: string;
    code: string;
    label: string;
    groupe: Groupe;
    visible: boolean;
}