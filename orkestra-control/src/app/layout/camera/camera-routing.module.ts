import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CameraComponent } from './camera.component';

const routes: Routes = [
    // { path: '', component: TasksComponent},

    {
        path: '', component: CameraComponent, data: {
            breadcrumb: 'Camera annotation UI',
            icon: 'fa fa-paint-brush'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CameraRoutingModule { }
