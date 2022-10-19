/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';

import {AbstractControl, FormControl, Validators} from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';



@Component({
  selector: 'app-add.dialog',
  templateUrl: 'add.dialog.component.html',
  styleUrls: ['add.dialog.css']
})

export class AddDialogComponent {
  istv:boolean = false;
  bitrate: any;
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dataService: DataService) { }

  formControl = new FormControl('', [
    Validators.required,
    this.noWhitespaceValidator
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('whitespace') ? 'Not a valid showname' :
        '';
  }
  public noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').split(' ').length == 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  submit() {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  isTv(){
    let val = this.data.type;
    return val == "tv";
  }
  resChanged(){
    
  
  }
  public confirmAdd(): void {
    this.dialogRef.close(this.data);
  }
}
