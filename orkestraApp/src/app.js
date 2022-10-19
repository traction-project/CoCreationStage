/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { Orkestra } from 'orkestraLib';
import { URI } from 'orkestraLib';
import { Divided } from 'orkestraLib';
import { Bytimeline } from 'orkestraLib';
import { ObjectSync } from 'orkestraLib';
import { Mosaic,EditLayout,CustomLayout } from 'orkestraLib';
import {Simple} from 'orkestraLib';
import {environmet} from './config/environmet.js';
import {translate} from './i18n/translate.js';
import 'splash-wc';
import {JanusEndpointService} from './plugins/janusEndPointService.js';
let locale = navigator.language.split('-')[0];
translate(URI.getUrlVar('locale')|| locale);
var synced = [];
var inter ;
var inter1 ;
var motionControls = [];
var transitions = [];
var onairAt=[];
var started=false;
var actMsgs = [];
var oldFrom ;
var oldMsg ;
var feeds = [];
var firstTime = true;
var notPreview = 0;
if (URI.getUrlVar("preview")=="true" || URI.getUrlVar("publish")=="false" || URI.getUrlVar("publish")==undefined) {
  if (URI.getUrlVar("preview")=="true") notPreview=1;
  document.querySelector('#camPreview').style.display="none";
  document.querySelector('#chat').style.display="none";
  document.querySelector('#camPreviewButton').classList.toggle('hide-force');
  document.querySelector('#chatAdminButton').classList.toggle('hide-force');

}
document.querySelector('#splashScreenButton').addEventListener('click', () => {
  if(window.location !== window.parent.location){
    document.querySelector('#camPreviewButton').style.display = 'none';
    document.querySelector('#chatAdminButton').style.display = 'none';
    document.querySelector('#chat').style.display = 'none';
    document.querySelector('#camPreview').style.display = 'none';
    document.querySelector('#orkestra-app').className = "col-span-12 row-span-3"
  }
  document.querySelector('#splashScreen').style.display = 'none';
  document.querySelector('#app').style.display = null;
});

document.querySelector('#drawer-inside').addEventListener('click', (event) => {
  if(event.target.id === 'drawer-inside'){
    if(document.querySelector('#camPreview').style.display === 'none' && 
        document.querySelector('#chat').style.display !== 'none' && 
        document.querySelector('#my-drawer').checked) {
      document.querySelector('#my-drawer').checked = false;
    }
    if(document.querySelector('#camPreview').style.display !== 'none' &&
        document.querySelector('#chat').style.display === 'none' && 
        document.querySelector('#my-drawer').checked) {
      document.querySelector('#my-drawer').checked = false;
    }
  }
});

document.querySelector('#camPreviewButton').addEventListener('click', () => {
  if(navigator.maxTouchPoints === 1) {
    if(window.screen.orientation.angle === 90) {
      document.querySelector('#camPreview').className = "row-span-3";
    } else {
      document.querySelector('#camPreview').className = "";
    }
  } 
  document.querySelector('#camPreview').style.display = null;
  document.querySelector('#chat').style.display = 'none';
});

document.querySelector('#chatAdminButton').addEventListener('click', () => {
  if(navigator.maxTouchPoints === 1) {
    if(window.screen.orientation.angle === 90) {
      document.querySelector('#chat').className = "row-span-3";
    } else {
      document.querySelector('#chat').className = "row-start-2 row-span-3";
    }
  } 
  document.querySelector('#camPreview').style.display = 'none';
  document.querySelector('#chat').style.display = null;
});

if (URI.getUrlVar('publish')==="true"){
  document.querySelector('orkestra-ui').style.position = 'relative';
  document.querySelector('#orkestra-app').style.width = '100%';
  document.querySelector('#publishButton').style.display="block";
  document.querySelector('#msgicon').style.display="block";
  document.querySelector('#publishButton').addEventListener('click',()=>{
  if (document.querySelector('webrtc-publisher').shadowRoot.querySelector('video').srcObject!=null){
    document.querySelector('#me_video').style.display="block";
    document.querySelector('webrtc-publisher').unpublish();
    document.querySelector('#publishButtonIcon').className="fas fa-video";
    started=false;
  }
  else {
    document.querySelector('#me_video').style.display="block";
    document.querySelector('webrtc-publisher').publish();
    document.querySelector('#publishButtonIcon').className="fas fa-stop";
    started=true;
   
  }
})
} else {
  document.querySelector('.drawer-side').style.display = 'none';
  


}

setTimeout(() => {

  var app = new Orkestra({ url: 'https://'+environmet.sharedState+'/',agentid: URI.getUrlVar('agent'), channel: URI.getUrlVar('channel'), privateChannel: false, profile: URI.getUrlVar('profile') || 'viewer', master: true });
  app.use(Bytimeline, { 'listenEvent': 'timeline', 'data': '[]' });
  let configJanus ='{"janusServer":\"'+environmet.janus+'\","muted":"true","room":'+URI.getUrlVar("room")+'}';
  if (URI.getUrlVar("preview")=="true") {
    configJanus ='{"janusServer":\"'+environmet.janus+'\","muted":"true","room":'+URI.getUrlVar("room")+',"profile":"low","showBitrate":"false","iframe":true}';
    
  }  // app.timerObservable.subscribe(x=>{
    //   motionControls.forEach((c)=>{
    //     c.reset(1.0);
    //     c.play();
    //  })
    // })
  else  {
    document.querySelector('#msgicon').addEventListener('click', ()=>{
      let users = JSON.parse(app.getUsers());
      let admin = users.find((usr) => {
        return usr[1].capacities.userProfile === "admin";
      })
      if (admin) {
        app.setUserContextData(admin[1].agentid, 'message', { msg: document.querySelector('#msg').value, from:app.getMyAgentId() });
        actMsgs.push("Me: " + document.querySelector('#msg').value);
        renderChat();
      }
      else alert("not admin connected");
      document.querySelector('#msg').value ="";
      document.querySelector('#chatbody').scrollTop+=100
     })
    if (URI.getUrlVar('publish')==="true"){
      window.res = 'HD';
    document.querySelector('webrtc-publisher').setOrkestraInstance(app);
    document.querySelector('webrtc-publisher').setAttribute('input', "dac_"+URI.getUrlVar('agent'));
    document.querySelector('webrtc-publisher').setAttribute('config',configJanus);
    document.querySelector('webrtc-publisher').setAttribute('options', '{"audio":true,"video":true,"simulcast":true,"bitrate":2000000,"noiseS":false,"echoC":false,"gainC":false,"delay":0,"showAudioInput":true}');
    document.querySelector('webrtc-publisher').setAttribute('style', 'width: 100%; height:24vh;');

    }
  }
  document.querySelector('orkestra-ui').querySelectorAll('x-media').forEach((xm)=>{xm.setAttribute('config',configJanus)});
  app.ui(EditLayout);
  app.ui(CustomLayout);
  app.ui(Mosaic);
  app.ui(Divided);
  app.transitions(Simple({background:'red',time:1500}));
  app.disableTransitions();
    //app.enableQRcode('body');
  var objectSync = new ObjectSync();
  app.enableSequencer(objectSync, URI.getUrlVar('channel'), environmet.motionServer);
  var PublishJanus;
  app.ui().useLayout('Divided',{});

  app.userObservable.subscribe(z => {
    //  user_table.users = app.getUsers();
    let me = app.users.get('me');
    if (me.userData && me.userData.canpublish && me.userData.canpublish === true) {
      document.querySelector('#b_publish').style.display = 'block';
    }
    else if (me.userData && me.userData.canpublish && me.userData.canpublish === false) document.querySelector('#b_publish').style.display = 'none';
    if (me.userData && me.userData.type == "mute") {
      //alert("mute received");
      var allvid = document.querySelectorAll('x-media');
      var ind = -1;
      allvid.forEach((v, i) => {
        if (v.id == me.userData.compid) {
          ind = i;
        }
      });
      if (ind > -1) {
        allvid[ind].querySelector('video').muted = true;
      }

    }
    else if (me.userData && me.userData.type == "unmute") {
      //alert("mute received");
      var allvid = document.querySelectorAll('x-media');
      var ind = -1;
      allvid.forEach((v, i) => {
        if (v.id == me.userData.compid) {
          ind = i;
        }
      });
      if (ind > -1) {
        allvid[ind].querySelector('video').muted = false;
      }

    }
    if (z.data.key == 'message' && z.data.value != "undefined" && z.data.value != '') {
      if (z.data.agentid == app.getMyAgentId() || z.data.value.from == app.getMyAgentId()) {
        if (( oldFrom != z.data.value.from || oldMsg != z.data.value.msg)){
          oldFrom = z.data.value.from;
          oldMsg = z.data.value.msg;

        if (z.data.value.from != app.getMyAgentId()){
          actMsgs.push("Admin: " + z.data.value.msg);
          renderChat();
        } 
         document.querySelector('#chatbody').scrollTop+=100

      }
     }
    }

  });
  setInterval(()=>{
    if(URI.getUrlVar("preview")!="true" && FlexJanus.feeds.length===0){
      document.querySelector('#textShowing').style.display = 'none';
      document.querySelector('#showAt').style.display = 'none';
      document.querySelector('#textNotShowing').style.display = 'block';
      document.querySelector('#circleShowing').style.display = 'none';
      document.querySelector('#circleNotShowing').style.display = 'none';
      document.querySelector('#showing').style.display = 'none';

    }
    else if (started){
      document.querySelector('#textShowing').style.display = 'block';
      document.querySelector('#showAt').style.display = 'block';
      document.querySelector('#showing').style.display = 'block';
      document.querySelector('#textNotShowing').style.display = 'none';
      document.querySelector('#circleShowing').style.display = 'block';
      document.querySelector('#circleNotShowing').style.display = 'none';
      document.querySelector('#showAt').innerHTML="";
      if(onairAt.length>0){
        for(var i=0;i<onairAt.length;i++){
            document.querySelector('#showAt').innerHTML=document.querySelector('#showAt').innerHTML+"<span class='flex-1' style='background-color:#ddd; margin-left:10px;border-radius:10px;color:#444;font-size:10px;'>"+onairAt[i].replace('-','_')+"</span>";
        }
      }
      else{
        document.querySelector('#textNotShowing').style.display = 'block';
        document.querySelector('#textShowing').style.display = 'none';

      }
    }
    else {
      document.querySelector('#textShowing').style.display = 'none';
      document.querySelector('#showAt').innerHTML="";
      document.querySelector('#textNotShowing').style.display = 'block';
      document.querySelector('#circleShowing').style.display = 'block';
      document.querySelector('#circleNotShowing').style.display = 'none';
      document.querySelector('#showing').style.display = 'block';

    }
  },1000)
  app.appObservable.subscribe(x => {

    if (x.key=="muteAll" && URI.getUrlVar("preview")=="true"){
       if (x.value === true || x.data.value === true){
         let xmedias = document.querySelectorAll('x-media');
         setTimeout(()=>{
            xmedias.forEach((m)=>{
              if(m.querySelector('video')) m.muteScene();
            })
         },500)
       }

    }
    
    if (URI.getUrlVar("preview")=="true"){
        let muteAll = app.getAppAttribute('muteAll');
        if (muteAll === true || x.data.value === true){
          let xmedias = document.querySelectorAll('x-media');
         setTimeout(()=>{
            xmedias.forEach((m)=>{
             if(m.querySelector('video')) m.muteScene();
            })
         },500)
        }

    }
    if (x.key==="appConfig") {
      let data; 
      if (x.value)
         data = x.value.transitionConfig;
      else  data = x.data.value.transitionConfig;
      let trans_color = data.color;
      let trans_time = data.time;
      app.removeTransition('Simple');
      app.transitions(Simple({background:trans_color,time:trans_time}));

    }
    if (x.key === "nosignals") {
      let nosignals;
      if(x.data){
         nosignals = x.data.value.data;
      }
      else{
         nosignals = x.value.data;
      }
      nosignals.forEach((signal)=>{
          let agentid = signal.agentid;
          let components = document.querySelector('orkestra-ui').querySelectorAll('x-media');
          setTimeout(()=>{
          components.forEach((xm)=>{
            let input = xm.getAttribute('input');
            if (input === agentid)
              xm.setAttribute('nosignalimg',signal.url);
          });
        },500);
      })
    }
    else 

    if (x.key == "timeline" && x.type === "appAttrChange") {
      if (x.applyTo) {
        let multimedia = x.data.map((v) => {
          if (v.source.indexOf('.mp4') > -1) {
            return { compId: v.id, url: v.source };
          }
        });
        //   console.log("multimedia",multimedia);
        //   multimedia.forEach((m)=>{
        //     if (m){
        //       let len = m.url.split('/').length;
        //       let session = m.url.split('/')[len-1];
        //       let id = parseInt(m.compId);
        //       setTimeout(()=>{
        //         let wcmp = document.querySelectorAll('x-media')[id].querySelector('video');
        //         let ctrl = app.syncObjects(wcmp,session);
        //         setTimeout(()=>{ctrl.play();},2000);
        //     },1000);
        //     }
        // });
      } else
        if (x.data.value.applyTo && (x.data.value.applyTo == app.getMyAgentId() || x.data.value.applyTo == "all")) {
          let multimedia = x.data.value.componentStatus.map((v) => {
            if (v.source.indexOf('.mp4') > -1) {
              return { compId: v.id, url: v.source };
            }
          });
          console.log("multimedia", multimedia);
          // multimedia.forEach((m)=>{
          //     if (m){
          //       let len = m.url.split('/').length;
          //       let session = m.url.split('/')[len-1];
          //       let id = parseInt(m.compId);
          //       setTimeout(()=>{
          //         let wcmp = document.querySelectorAll('x-media')[id].querySelector('video');
          //         let ctrl = app.syncObjects (wcmp,session);
          //         motionControls.push(ctrl);
          //         setTimeout(()=>{ctrl.play();},2000);
          //     },1000);
          //     }
          // });
        }
    }
    else if(x.key && x.key.indexOf("timeline_")>-1 && x.value && x.value.applyTo && x.value.applyTo==app.getMyAgentId()){
      createXMediaComps(x.value.componentStatus.length);
      
    }
    else if(x.data && x.data.key.indexOf("timeline_")>-1 && x.data.value.applyTo && x.data.value.applyTo==app.getMyAgentId()){
      createXMediaComps(x.data.value.componentStatus.length);
    }
      else if(x.key=='nosignalimg'){
      if(x.data){
        document.querySelector('orkestra-ui').querySelectorAll('x-media').forEach((xm)=>{xm.setAttribute('nosignalimg',x.data.value)});
      }
      else{
        document.querySelector('orkestra-ui').querySelectorAll('x-media').forEach((xm)=>{xm.setAttribute('nosignalimg',x.value)});
      }
    }
    else if(x.key.indexOf("transitions_"+app.getMyAgentId())!=-1){
      if(x.data){
        transitions = x.data.value;
      }
      else{
        transitions = x.value;
      }
    }
    else if(x.key.indexOf("onair_"+app.getMyAgentId())!=-1){
      if(x.data){
        onairAt=x.data.value;
        if(onairAt.length>0 && started==true){
          document.querySelector('#circleShowing').style.display = 'block';
          document.querySelector('#circleNotShowing').style.display = 'none';
          document.querySelector('#textShowing').style.display = 'block';
          document.querySelector('#textNotShowing').style.display = 'none';
          document.querySelector('#showAt').innerHTML="";
          for(var i=0;i<onairAt.length;i++){
              document.querySelector('#showAt').innerHTML=document.querySelector('#showAt').innerHTML+"<span style='background-color:#ddd; margin-left:10px;padding:2px;border-radius:10px;color:#444;font-size:10px;'>"+onairAt[i]+"</span>";
          }
        }
        else{
          document.querySelector('#circleShowing').style.display = 'none';
          document.querySelector('#circleNotShowing').style.display = 'block';
          document.querySelector('#textShowing').style.display = 'none';
          document.querySelector('#textNotShowing').style.display = 'block';
          document.querySelector('#showAt').innerHTML="";
        }
      }
      else{
        onairAt=x.value;
        console.log('ONAIR',onairAt);
      }
    }
   else if(x.key.indexOf("play")!=-1){
        let val = x.data.value;
        if (val === true){
          document.querySelectorAll('x-media').forEach((el) => {
            if (el.loaded === true) el.play();
          })
        }
        else {
          document.querySelectorAll('x-media').forEach((el) => {
            if (el.loaded === true) el.pause();
          })
        }
   }
  });
  function createXMediaComps(cmpNum){
    if(document.querySelectorAll('x-media').length<cmpNum){
      for(var i=document.querySelectorAll('x-media').length;i<cmpNum;i++){
        var auxxm = document.createElement('x-media');
        auxxm.setAttribute('id','v'+i);
        auxxm.setAttribute('config',configJanus);
        document.querySelector('orkestra-ui').appendChild(auxxm);
      }
    }
    if (app.getAppAttribute('nosignals')) {
      let nosignals = app.getAppAttribute('nosignals').data;
      nosignals.forEach((signal)=>{
          let agentid = signal.agentid;
          let components = document.querySelector('orkestra-ui').querySelectorAll('x-media');
          setTimeout(()=>{
          components.forEach((xm)=>{
            let input = xm.getAttribute('input');
            if (input === agentid)
              xm.setAttribute('nosignalimg',signal.url);
          });
        },500);
      })
    }
  }
  app.readyObservable.subscribe(x => {
    if (!URI.getUrlVar("preview")) app.data('message',Message,'');
    console.log("AGENTID",app.getMyAgentId());
    let inter = setInterval(()=>{
      let meId = app.getMyAgentId();
      if (meId!=-1){
        clearInterval(inter);
        app.subscribe("layout_"+app.getMyAgentId());
        app.subscribe("timeline_"+app.getMyAgentId());
        app.subscribe("nosignalimg");
        app.subscribe("nosignals");
        app.subscribe("play");
        app.subscribe("onair_"+app.getMyAgentId());
        app.subscribe("transitions_"+app.getMyAgentId());
        app.subscribe("appConfig");
        if (URI.getUrlVar("preview")=="true")  app.subscribe("muteAll");
      }
  },50);
    document.body.style.display = "block";

  });


document.addEventListener('click',(e)=>{
  parent.postMessage({id:app.getMyAgentId()},"*");
});
  // IFRAME INTERFACE TO RECEIVE EVENTS AS MUTE
 /* window.addEventListener("message", (e) => {
    if (e.data.cmd && e.data.cmd == "mute") {
      document.querySelectorAll('x-media').forEach((el) => {
        let config = JSON.parse(el.getAttribute('config'));
        config.me = e.data.agentid;
        el.setAttribute('config', JSON.stringify(config));
      })
    }
  }, false);
*/
function renderChat(){

  let  html="";
        actMsgs.forEach((m)=>{
          if(m.includes("Admin")) {
            html+=`<div class="chat-message mt-2">
            <div class="flex items-end justify-end">
              <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">`+ m +`</span></div>
              </div>
            </div>
          </div>`;
          } else {
            html+=`<div class="chat-message mt-2">
            <div class="flex items-end">
              <div class="flex flex-col space-y-2 text-xs max-2-xs mx-2 order-2 items-start">
                <div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">`+ m +`</span></div>
              </div>
            </div>
          </div>`;
          }         
        })
        document.querySelector('#chatbody').innerHTML = html;
        var element = document.getElementById("chatbody").parentElement;
        var parentElement = document.getElementById("chatbody").parentElement
        parentElement.scrollTop = element.scrollHeight;
}
  app.timerObservable.subscribe(timeObject => {
     if (firstTime !== true) {
       if(transitions[timeObject.target.currentTime]=="true"){
         app.enableTransition("Simple");
       }
       else{
         app.disableTransition("Simple");
       }
    }
    firstTime = false;
    if (URI.getUrlVar("preview")=="true"){
      let muteAll = app.getAppAttribute('muteAll');
      if (muteAll === true || x.data.value === true){
        let xmedias = document.querySelectorAll('x-media');
       setTimeout(()=>{
          xmedias.forEach((m)=>{
           if(m.querySelector('video')) m.muteScene();
          })
       },200)
      }

  }
  });
  // utils: append association helper: QRCode
  /** Motion **/
  document.querySelector('#loading').remove();
  document.querySelector('#publishButton').disabled = false;
  document.querySelector('#msgicon').disabled = false;
  document.addEventListener('keydown',(ev)=>{
    if (ev.keyCode != 13) return;
    let users = JSON.parse(app.getUsers());
    let admin = users.find((usr) => {
      return usr[1].capacities.userProfile === "admin";
    })
    if (admin) {
      app.setUserContextData(admin[1].agentid, 'message', { msg: document.querySelector('#msg').value, from:app.getMyAgentId() });
      actMsgs.push("Me: " + document.querySelector('#msg').value);
      renderChat();
    }
    else alert("not admin connected");
    document.querySelector('#msg').value ="";
    document.querySelector('#chatbody').scrollTop+=100

  })
},  Math.floor(Math.random() * Math.floor(8)) * 1000*notPreview);
