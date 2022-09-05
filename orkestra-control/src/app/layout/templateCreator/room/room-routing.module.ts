import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

import { RoomComponent } from './room.component'

const routes: Routes = [
    // { path: '', component: TasksComponent},

    {
            path: '', component: RoomComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoomRoutingModule { }
