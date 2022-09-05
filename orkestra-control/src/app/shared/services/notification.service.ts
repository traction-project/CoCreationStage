import {MatSnackBar} from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';


@Injectable()
export class NotificationService {
    constructor (private _snackBar: MatSnackBar){

    }

    
    openSnackBar(message: string, duration: number) {
        this._snackBar.open(message,"" ,{
          duration: duration,
          verticalPosition: 'top'
        });
      }
}