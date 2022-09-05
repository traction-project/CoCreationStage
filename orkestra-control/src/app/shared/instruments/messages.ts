export function Message(msg){

   let m = {
    init:function(){
       this.setCapability("message", "supported");
       this.setItem('message', msg || 'undefined');
    },
    on:function(){

       this.setItem('message', msg || 'undefined');

    },
    off:function(){

    }
  }
  return {"message":m};
}
