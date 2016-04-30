/**
 * Created by Julien on 24/04/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {TrackingService} from "../shared/tracking.service";
import {Annee} from "../shared/annee";
import {Iteration} from "../shared/iteration";

@Component({
    selector: 'mes-temps',
    template: `
<b>{{selectedAnnee|json}}</b><br>
<select class="form-control" required (change)="onSelectAnnee($event)">
    <option *ngFor="#annee of annees" [selected]="annee.label === selectedAnnee.label">
        {{annee.label}}
    </option>
</select>
<select class="form-control">
    <option *ngFor="#ite of iterations" [value]="ite">
        {{ite.iteration}}
    </option>
</select>
    `
})

export class MesTempsComponent implements OnInit {
    constructor(private _trackingService: TrackingService) {
    }

    public annees: Annee[];
    public iterations: Iteration[];
    public selectedAnnee: Annee;
    private errorMessage: string;


    ngOnInit() {
        this.getAnnes();
        this.getSelectedAnnee();
        this.getIterations();
    }

    getAnnes() {
        this._trackingService.annees
            .subscribe(
                annees => this.annees = annees,
                error => this.errorMessage = <any>error
            )
    }

    getSelectedAnnee() {
        this._trackingService.selectedAnnee.subscribe(
            annee => this.selectedAnnee = annee,
            error => this.errorMessage = <any>error
        )
    }

    getIterations() {
        this._trackingService.iterations.subscribe(
            iterations => this.iterations = iterations,
            error => this.errorMessage = <any>error
        )
    }

    onSelectAnnee(event): void {
        this._trackingService.selectAnnee({label: event.target.value});
    }
}