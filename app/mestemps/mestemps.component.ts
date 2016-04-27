/**
 * Created by Julien on 24/04/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {TrackingService} from "../shared/tracking.service";
import {Annee} from "../shared/annee";

@Component({
    selector: 'mes-temps',
    template: `<b>{{selectedAnnee|json}}</b>
    <ul>
    <li *ngFor="#annee of annees">
    <span>{{annee.label}}</span>
</li>
</ul>
    `
})

export class MesTempsComponent implements OnInit {
    constructor(private _trackingService: TrackingService) {
    }

    public annees: Annee[];
    public selectedAnnee: Annee;
    private errorMessage: string;


    ngOnInit() {
        this.getAnnes();
        this.getSelectedAnnee();
    }

    getAnnes() {
        this._trackingService.annees
            .subscribe(
                annees => this.annees = annees,
                error => this.errorMessage = <any>error
            )
    }

    getSelectedAnnee() {
        this._trackingService.trackingAppState.subscribe(
            state => this.selectedAnnee = state.selectedAnnee,
            error => this.errorMessage = <any>error
        )
    }
}