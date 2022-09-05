import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UploadService } from '../upload.service';
import { forkJoin } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit {
  @ViewChild('file', { static: false }) file;
  @ViewChild('file2', { static: false }) file2;

  public files: Set<File> = new Set();

  constructor(public dialogRef: MatDialogRef<DialogComponent>, public uploadService: UploadService,public dataService:DataService) { }

  ngOnInit() { }

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  onFolderAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        let f:any = files[key];
        f.audio = true;
        this.files.add(f);

      }
    }
   
  }
  onFilesAdded() {
    const files: { [key: string]: File } = this.file2.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        let f:any = files[key];
        f.audio = true;
        this.files.add(f);

      }
    }
   
  }
  addFolder() {
    this.file.nativeElement.click();
  }
  addFiles() {
    this.file2.nativeElement.click();
  }
  fileAudioChange(evt:any,file:any){
    file.audio = evt.checked;
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files);
    console.log(this.progress);
    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => console.log(val));
    }

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;
      this.showCancelButton = true;
      // ... the upload was successful...
      this.uploadSuccessful = true;
      this.uploadService.data.forEach((d)=>{
    	    this.dataService.addMediaFileToShow(d);
      });
      // ... and the component is no longer uploading
      this.uploading = false;
    },err =>{
      this.canBeClosed = true;
      this.uploading = false;
      this.showCancelButton = true;
      this.uploadSuccessful = false;
      this.dialogRef.disableClose = false;
      this.dialogRef.close();
    });
  }
}
