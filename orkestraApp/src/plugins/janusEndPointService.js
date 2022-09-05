class JanusEndpointService{

  constructor(environment){
     this.environment = environment;
     this.post = function(url,options){
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(options));
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };
      });
      
    }
  }
  connectToEndPoint(){
    return new Promise((resolve, reject) =>{
      this.createSession().then((ev)=>{
        this.session = JSON.parse(ev).data.id;
        this.attachToPlugin().then((ev1)=>{
          this.pluginId = JSON.parse(ev1).data.id;
          resolve("ok");
        },(error)=>reject("error attaching"))
      },(error)=>reject("error creating session"))
    })
  }
  createSession(){
    this.trasnaction = "dkididiediewewq1";
    let url = "https://"+this.environment.janus+":"+8089+"/janus";
    let options = {
      "janus":"create",
      "transaction":this.trasnaction
    }
    return this.post(url,options)
  }
  attachToPlugin(){
    let url = "https://"+this.environment.janus+":"+8089+"/janus/"+this.session;
    let options = {"janus":"attach","plugin":"janus.plugin.videoroom","transaction":this.trasnaction};
    return this.post(url,options)
  }
  getParticipants(room){
    return new Promise((resolve, reject)=>{
      this.connectToEndPoint().then(()=>{
        let url = "https://"+this.environment.janus+":"+8089+"/janus/"+this.session+"/"+this.pluginId;
        let options = {"janus": "message", "body": {"request": "listparticipants","room":room}, "transaction": this.trasnaction}
        this.post(url,options).then(ev=>{
          resolve(JSON.parse(ev));
        },(error)=>reject("error"))

      })
    })
  }
}
export {JanusEndpointService}
