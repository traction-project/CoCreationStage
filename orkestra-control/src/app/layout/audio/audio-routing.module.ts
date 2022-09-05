import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AudioComponent } from './audio.component';

const routes: Routes = [
    // { path: '', component: TasksComponent},

    {
        path: '', component: AudioComponent, data: {
            breadcrumb: 'Audio annotation UI',
            icon: 'fa fa-paint-brush'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AudioRoutingModule { }
