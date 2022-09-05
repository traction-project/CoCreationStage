import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PlayerComponent } from './player.component';

const routes: Routes = [
    // { path: '', component: TasksComponent},

    {
        path: '', component: PlayerComponent, data: {
            breadcrumb: 'Audio annotation UI',
            icon: 'fa fa-paint-brush'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerRoutingModule { }
