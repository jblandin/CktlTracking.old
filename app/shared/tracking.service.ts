/**
 * Created by Julien on 25/04/2016.
 */
import {Injectable} from "angular2/core";
import {Http, Response} from 'angular2/http';

import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {EmptyObservable} from "rxjs/observable/EmptyObservable";
import {Subject} from "rxjs/Subject";

import {Annee} from "./annee";
import {Iteration} from "./iteration";
import {Declinaison} from "./declinaison";
import {Groupe} from "./groupe";
import {Utilisateur} from "./utilisateur";


@Injectable()
export class TrackingService {
    private _anneesUrl = "app/shared/datas/annees.json";
    private _groupesUrl = "app/shared/datas/groupes.json";
    private _utilisateursUrl = "app/shared/datas/utilisateurs.json";

    annees: Observable<Annee[]>;
    iterations: Observable<Iteration[]>;
    groupes: Observable<Groupe[]>;
    private allUtilisateurs: Observable<Utilisateur[]>;
    utilisateurs: Observable<Utilisateur[]>;

    selectedAnnee: Subject<Annee> = new BehaviorSubject<Annee>(undefined);
    selectedIteration: Subject<Iteration> = new BehaviorSubject<Iteration>(undefined);
    selectedGroupe: Subject<Groupe> = new BehaviorSubject<Groupe>(undefined);
    selectedUtilisateur: Subject<Utilisateur> = new BehaviorSubject<Utilisateur>(undefined);

    constructor(private http: Http) {
        this.annees = this.http.get(this._anneesUrl)
            .map((res: Response) => {
                let listeAnnees: Annee[] = this.extractDatas(res);
                this.selectAnnee(listeAnnees[listeAnnees.length - 1]);
                return listeAnnees;
            })
            .catch(this.handleError);

        this.iterations = this.selectedAnnee
            .flatMap(annee => {
                if (annee) {
                    let url = "app/shared/datas/iterations_" + annee.label + ".json";
                    return this.http.get(url);
                } else {
                    return EmptyObservable.create();
                }
            })
            .map(this.extractDatas)
            .catch(this.handleError);

        this.groupes = this.http.get(this._groupesUrl)
            .map(this.extractDatas)
            .catch(this.handleError);

        this.allUtilisateurs = this.http.get(this._utilisateursUrl)
            .map(this.extractDatas)
            .catch(this.handleError);

        this.utilisateurs = this.selectedGroupe
            .flatMap((groupe: Groupe) => {
                return this.allUtilisateurs
                    .map((utilisateurs: Utilisateur[]) => {
                        return utilisateurs.filter((utilisateur: Utilisateur) => {
                            return !groupe || utilisateur.groupe.id === groupe.id;
                        });
                    });
            })
            .catch(this.handleError);
    }

    selectAnnee(annee: Annee): void {
        this.selectedAnnee.next(annee);
        this.selectIteration(undefined);
    }

    selectIteration(iteration: Iteration): void {
        this.selectedIteration.next(iteration);
    }

    selectGroupe(groupe: Groupe): void {
        this.selectedGroupe.next(groupe);
    }

    /////////////////////////////////////////////////////////////////////

    private extract(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data;
    }

    private extractDatas = (res: Response) => {
        if (!res) {
            return [];
        }
        return this.extract(res) || [];
    };

    private extractData = (res: Response) => {
        return this.extract(res) || {};
    };

    private handleError(error: any) {
        let errMsg = error.message || 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}