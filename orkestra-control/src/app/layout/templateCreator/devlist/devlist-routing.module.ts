import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevlistComponent } from './devlist.component'

const routes: Routes = [
    // { path: '', component: TasksComponent},

    {
            path: '', component: DevlistComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DevlistRoutingModule { }
