export class RtspCam {
  name:string = "";
  uri:string = "";
  bitrate="800000";
  constructor(name:string, uri:string){
      this.name = name;
      this.uri = uri;
  }
}
