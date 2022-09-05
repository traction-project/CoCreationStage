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
