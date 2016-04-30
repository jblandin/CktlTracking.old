/**
 * Created by Julien on 24/04/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {Control} from "angular2/common";
import {TrackingService} from "../shared/tracking.service";
import {Annee, Iteration, Declinaison} from "../shared/shared";

@Component({
    selector   : 'mes-temps',
    templateUrl: 'app/mestemps/mestemps.html'
})

export class MesTempsComponent implements OnInit {
    constructor(private _trackingService: TrackingService) {
    }

    public annees: Annee[];
    public iterations: Iteration[];

    public selectedAnnee: Annee;
    public selectedIteration: Iteration;
    public selectedGroupe: Declinaison;

    public selectedIterationControl: Control = new Control('');
    public selectedGroupeControl: Control = new Control('');

    private errorMessage: string;
    private errorHandler = (error) => this.errorMessage = <any>error;

    ngOnInit() {
        this.getAnnes();
        this.getSelectedAnnee();
        this.getIterations();
        this.getSelectedIteration();
        this.getSelectedGroupe();

        // Subscribe controls
        this.selectedIterationControl.valueChanges.subscribe(
            iteration => this._trackingService.selectIteration(iteration),
            this.errorHandler
        );
        this.selectedGroupeControl.valueChanges.subscribe(
            groupe => this._trackingService.selectGroupe(groupe),
            this.errorHandler
        );
    }

    getAnnes() {
        this._trackingService.annees.subscribe(
            annees => this.annees = annees,
            this.errorHandler
        );
    }

    getSelectedAnnee() {
        this._trackingService.selectedAnnee.subscribe(
            annee => this.selectedAnnee = annee,
            this.errorHandler
        );
    }

    getIterations() {
        this._trackingService.iterations.subscribe(
            iterations => this.iterations = iterations,
            this.errorHandler
        );
    }

    getSelectedIteration() {
        this._trackingService.selectedIteration.subscribe(
            iteration => this.selectedIteration = iteration,
            this.errorHandler
        );
    }

    getSelectedGroupe() {
        this._trackingService.selectedGroupe.subscribe(
            groupe => this.selectedGroupe = groupe,
            this.errorHandler
        );
    }

    onSelectAnnee(event): void {
        // FIXME Passer par un Control
        this._trackingService.selectAnnee({label: event.target.value});
    }

}