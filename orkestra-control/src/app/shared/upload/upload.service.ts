import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

const url = environment.mediaVault;
const resolutions = environment.resolutions;
const s3 = "https://d2pjmukh9qywdn.cloudfront.net/";
const tokken = "";
/*d2pjmukh9qywdn.cloudfront.net*/
@Injectable()
export class UploadService {
  data:any=[];
  constructor(private http: HttpClient,private authService:AuthService) {


   }

  public upload(
    files: Set<File>
  ): { [key: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      let headers = new HttpHeaders();
      headers.append('authorization', "Bearer "+this.authService.getTokken());
      console.log(headers);
      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', url+"api/upload/raw", formData, {
        reportProgress: true,
	      headers:new HttpHeaders()
	    .set('Authorization','Bearer '+this.authService.getTokken())
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates

      const startTime = new Date().getTime();
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
	         this.data.push({name:file.name,url:(event.body as any).name,audio:file["audio"]});
          progress.complete();
  
        }
      },error=>{
          progress.error(error);
          alert("error upload file");
          console.log(error);
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
	
      };
    });

    // return the map of progress.observables
    return status;
  }
  public encode(_file:any,resolutions:any){
      let headers = new HttpHeaders();
      headers.append('authorization', "Bearer "+this.authService.getTokken());
      console.log("File has audio",_file["audio"]);
      const req = new HttpRequest('POST',url+"api/upload/encode", {"input":_file.url,"resolutions":resolutions,"hasAudio":_file["audio"]}, {
      reportProgress: false,
      headers:new HttpHeaders()
	    .set('Authorization','Bearer '+this.authService.getTokken())
    });
    this.http.request(req).subscribe(event => {
      if (event instanceof HttpResponse) {
         console.log(event);
      }
    });

  }
}
