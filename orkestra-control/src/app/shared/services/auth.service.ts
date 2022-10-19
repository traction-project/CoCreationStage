import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse
} from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Subject, Observable } from 'rxjs';

const url = environment.mediaVault;

const tokken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM5MGQ0NjI3LWM2MzQtNDgyNS04YTk3LTk3OWIyYzM1MDQ2OCIsInVzZXJuYW1lIjoiaXRhbWF5byIsImV4cCI6MTYxMTM5NTYzMywiaWF0IjoxNjA2MjExNjMzfQ.UJ6NRGD5r9P27jkdGGZLtOUOE0cP8vWP_ApiVO6t64M";
/*d2pjmukh9qywdn.cloudfront.net*/
@Injectable()
export class AuthService {
  tokken:string="";
  constructor(private http: HttpClient) {

      this.login("test","1234")
   }
   login(user:string,password:string){
        let options:any =  {
           
          }
        let body ={
            "username": "test",
            "password": "1234",
        }
        this.http.post(url+'/api/login',body,options).subscribe((e:any)=>{
                this.tokken = e.token;
        });
   }
   getTokken():string {

        return this.tokken;
    }
}
