
import {TimingObject} from './src/TimingObject.js'
import {SocketTimingProvider} from './src/SocketTimingProvider.js'
import {TimingMediaController} from './src/TimingMediaController.js'
import {StateVector} from './src/StateVector.js'
import {ObjectSync} from './src/ObjectSync.js'
import {Utils} from './src/utils.js'
import {EventTarget} from './src/event-target.js';

    var Motion = function(url,channel){

      /**********************************************************************
      No need to deal with time, position and velocity measures that are
      below 1ms, so round all floats to 3 decimals.
      **********************************************************************/
      var roundFloat = function (nb) {
        return Math.round(nb * 1000) / 1000;
      };


      /**********************************************************************
      Set up the logger, using a custom DOM element appender
      **********************************************************************/



      /**********************************************************************
      Pointers to useful DOM elements
      **********************************************************************/


      /**********************************************************************
      Display timing object and video positions
      **********************************************************************/
      var maxDiff = {
        position: 0,
        velocity: 0
      };
      var controller = undefined;
      var timing = undefined;
      var tnpTime = 0;
      /**********************************************************************
      Create the timing object associated with the online timing service
      **********************************************************************/
      var start = function (){
        let domain = Utils.getHostName(url);
        var timingProvider = new SocketTimingProvider('wss://'+domain+':8080/'+(channel || 'test'));

	  timing = new TimingObject();
          timing.srcObject = timingProvider;
          controller = new TimingMediaController(timing);

        }
        var addMedia = function(media,offset){
          controller.addMediaElement(media,offset);
          controller.addEventListener('readystatechange', function (evt) {

            if (evt.value === 'open') {
              API.dispatchEvent({type:'motionReady',value:evt.target.currentTime});
            }
          });

          return controller;
        }
        var removeMedia = function(media){
          controller.removeMediaElement(media);
        }
        /**********************************************************************
        Enable commands when timing object is connected
        **********************************************************************/
        var getController = function (){
          return controller;
        }
        var getTiming = function (){
          return timing;
        }

         var API = {
          addObject:addMedia,
          removeObject:removeMedia,
          getController:getController,
          start:start,
          ready:false,
          timing:getTiming,
          live:false,
          ObjectSync:ObjectSync,
          initTime:0
        }


        API.removeEventListener = EventTarget().removeEventListener;
        API.addEventListener = EventTarget().addEventListener;
        API.dispatchEvent = EventTarget().dispatchEvent;
        return API;
      }


export {Motion,ObjectSync};
