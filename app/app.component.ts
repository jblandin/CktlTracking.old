import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {TrackingService} from "./shared/tracking.service";
import {MesTempsComponent} from "./mestemps/mestemps.component";
import {HTTP_PROVIDERS} from "angular2/http";

@Component({
    selector  : 'app-tracking',
    template  : `
    <h1>{{title}}</h1>
    <nav>
        <a [routerLink]="['MesTemps']">Mes temps</a>
    </nav>
    <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES],
    providers : [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        TrackingService
    ]
})

@RouteConfig([
    {
        path     : '/mestemps',
        name     : 'MesTemps',
        component: MesTempsComponent
    }
])

export class AppComponent {
    public title = "Tracking";
}