/**
 * Created by Julien on 25/04/2016.
 */
import {Injectable} from "angular2/core";
import {Http, Response} from 'angular2/http';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";
import {Annee} from "./annee";
import {Iteration} from "./iteration";
import {Declinaison} from "./declinaison";

interface TrackingAppState {
    selectedAnnee: Annee;
}

@Injectable()
export class TrackingService {
    private _anneesUrl = "app/shared/datas/annees.json";

    trackingAppState: Subject<TrackingAppState> = new BehaviorSubject<TrackingAppState>({selectedAnnee: null});
    annees: Observable<Annee[]>;
    iterations: Observable<Iteration[]>;

    selectedAnnee: Subject<Annee> = new BehaviorSubject<Annee>(undefined);
    selectedIteration: Subject<Iteration> = new BehaviorSubject<Iteration>(undefined);
    selectedGroupe: Subject<Declinaison> = new BehaviorSubject<Declinaison>(undefined);

    constructor(private http: Http) {
        this.annees = this.http.get(this._anneesUrl)
            .map((res: Response) => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Bad response status: ' + res.status);
                }
                let body = res.json();
                let listeAnnees: Annee[] = body.data || [];
                this.trackingAppState.next({selectedAnnee: listeAnnees[listeAnnees.length - 1]});
                this.selectAnnee(listeAnnees[listeAnnees.length - 1]);
                return listeAnnees;
            })
            .catch(this.handleError);

        this.iterations = this.selectedAnnee
            .map(annee => {
                if (annee) {
                    return "app/shared/datas/iterations_" + annee.label + ".json";
                }
            })
            .flatMap((url) => url ? this.http.get(url) : Observable.empty())
            .map((res: Response) => {
                if (!res) {
                    return [];
                }
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Bad response status: ' + res.status);
                }
                let body = res.json();
                return body.data;
            });


    }

    selectAnnee(annee: Annee): void {
        this.selectedAnnee.next(annee);
        this.selectIteration(undefined);
    }

    selectIteration(iteration: Iteration): void {
        this.selectedIteration.next(iteration);
        this.selectGroupe(undefined);
    }

    selectGroupe(groupe: Declinaison): void {
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