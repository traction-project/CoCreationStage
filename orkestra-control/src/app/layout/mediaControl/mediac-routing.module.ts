import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { MediaCComponent } from './mediac.component'

const routes: Routes = [
    // { path: '', component: TasksComponent},

    {
        path: '', component: MediaCComponent, data: {
            breadcrumb: 'Bbox annotation UI',
            icon: 'fa fa-paint-brush'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes),FormsModule, ReactiveFormsModule ],
    exports: [RouterModule]
})
export class MediaCRoutingModule { }
