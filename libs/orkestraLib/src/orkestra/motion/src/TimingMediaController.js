
/**
 * @file A timing media controller takes inputs from a timing object and
 * harnesses one or more HTML media elements (audio, video, media controller)
 * accordingly.
 *
 * A timing media controller exposes usual media element controls such as
 * "play", "pause" methods as well as "currentTime" and "playbackRate"
 * attributes. Internally, calling these methods or setting these attributes
 * update the timing object's state vector, which should in turn affect the
 * HTML media elements that the timing media controller harnesses.
 *
 * Said differently, commands sent to a timing media controller are not
 * directly applied to the HTML media elements under control. Everything goes
 * through the timing object to enable cross-device synchronization effects.
 *
 * TODO: add logic to handle buffering hiccups in media elements.
 * TODO: add logic to remove elements from the list of controlled elements.
 */

// Ensure "define" is defined in node.js in the absence of require.js
// See: https://github.com/jrburke/amdefine


  import {EventTarget} from './event-target';
  import {TimingObject} from './TimingObject'
  import {StateVector} from './StateVector';


  /**
   * Constructor of a timing media controller
   *
   * @class
   * @param {TimingObject} timing The timing object attached to the controller
   * @param {Object} options controller settings
   */
  var TimingMediaController = function (timing, options) {
    var self = this;
    options = options || {};

    if (!timing || (!timing instanceof TimingObject)) {
      throw new Error('No timing object provided');
    }

    /**
     * The timing media controller's internal settings
     */
    var settings = {
      // Media elements are considered in sync with the timing object if the
      // difference between the position they report and the position of the
      // timing object is below that threshold (in seconds).
      minDiff: options.minDiff || 0.040,

      // Maximum delay for catching up (in seconds).
      // If the code cannot meet the maxDelay constraint,
      // it will have the media element directly seek to the right position.
      maxDelay: options.maxDelay || 0.8,

      // Amortization period (in seconds).
      // The amortization period is used when adjustments are made to
      // the playback rate of the video.
      amortPeriod: options.amortPeriod || 1.0
    };


    /**
     * The list of Media elements controlled by this timing media controller.
     *
     * For each media element, the controller maintains a state vector
     * representation of the element's position and velocity, a drift rate
     * to adjust the playback rate, whether we asked the media element to
     * seek or not, and whether there is an amortization period running for
     * the element
     *
     * {
     *   vector: {},
     *   driftRate: 0.0,
     *   seeked: false,
     *   amortization: false,
     *   element: {}
     * }
     */
    var controlledElements = [];


    /**
     * The timing object's state vector last time we checked it.
     * This variable is used in particular at the end of the amortization
     * period to compute the media element's drift rate
     */
    var timingVector = null;


    /**
     * Pointer to the amortization period timeout.
     * The controller uses only one amortization period for all media elements
     * under control.
     */
    var amortTimeout = null;


    Object.defineProperties(this, {
      /**
       * Report the state of the underlying timing object
       *
       * TODO: should that also take into account the state of the controlled
       * elements? Hard to find a proper definition though
       */
      readyState: {
        get: function () {
          return timingProvider.readyState;
        }
      },


      /**
       * The currentTime attribute returns the position that all controlled
       * media elements should be at, in other words the position of the
       * timing media controller when this method is called.
       *
       * On setting, the timing object's state vector is updated with the
       * provided value, which will (asynchronously) affect all controlled
       * media elements.
       *
       * Note that getting "currentTime" right after setting it may not return
       * the value that was just set.
       */
      currentTime: {
        get: function () {
          return timing.currentPosition;
        },
        set: function (value) {
          timing.update(value, null);
        }
      },


      /**
       * The current playback rate of the controller (controlled media elements
       * may have a slightly different playback rate since the role of the
       * controller is precisely to adjust their playback rate to ensure they
       * keep up with the controller's position.
       *
       * On setting, the timing object's state vector is updated with the
       * provided value, which will (asynchronously) affect all controlled
       * media elements.
       *
       * Note that getting "playbackRate" right after setting it may not return
       * the value that was just set.
       */
      playbackRate: {
        get: function () {
          return timing.currentVelocity;
        },
        set: function (value) {
          timing.update(null, value);
        }
      }
    });


    /**
     * Start playing the controlled elements
     *
     * @function
     */
    this.play = function () {
      timing.update(null, 1.0,null);
    };


    /**
     * Pause playback
     *
     * @function
     */
    this.pause = function () {
      timing.update(null, 0.0,null);

    };
    this.reset = function (vel) {
      timing.update(0.0,vel,null);
    };
    this.seek = function (time,vel) {
      timing.update(time, vel,null);
    };
    this.incPlayBacRate = function (){
      this.playbackRate+=0.3;
    }
    this.decPlayBacRate = function(){
      this.playbackRate-=0.3;
    }
    /**
     * Add a media element to the list of elements controlled by this
     * controller
     *
     * @function
     * @param {MediaElement} element The media element to associate with the
     *  controller.
     */
    this.addMediaElement = function (element,offset) {
      var found = false;
    if (element) {

      console.log("OFFSET",offset/1000);
      element._offset = offset/1000;
      controlledElements.forEach(function (wrappedEl) {
        if (wrappedEl.element === element) {

          found = true;
        }
      });
      if (found) {
        return;
      }
      controlledElements.push({
        element: element,
        vector: null,
        driftRate: 0.0,
        seeked: false,
        amortization: false
      });
      }
    };
    this.removeMediaElement = function (element) {
      var found = false;
      controlledElements = controlledElements.filter(function (wrappedEl) {
        if (wrappedEl.element === element) {
            return false;
        }
        else return true;
      });


    };

    /**
     * Helper function that cancels a running amortization period
     */
    var cancelAmortizationPeriod = function () {
      if (!amortTimeout) {
        return;
      }
      clearTimeout(amortTimeout);
      amortTimeout = null;
      controlledElements.forEach(function (wrappedEl) {
        wrappedEl.amortization = false;
        wrappedEl.seeked = false;
      });
    };


    /**
     * Helper function to stop the playback adjustment once the amortization
     * period is over.
     */
    var stopAmortizationPeriod = function () {
      var now = Date.now() / 1000.0;
      amortTimeout = null;

      controlledElements.forEach(function (wrappedEl) {
        // Nothing to do if element was not part of amortization period
        if (!wrappedEl.amortization) {
          return;
        }
        wrappedEl.amortization = false;

        // Don't adjust playback rate and drift rate if video was seeked
        // or if element was not part of that amortization period.
        if (wrappedEl.seeked) {

          wrappedEl.seeked = false;
          return;
        }

        // Compute the difference between the position the video should be and
        // the position it is reported to be at.
        var diff = wrappedEl.vector.computePosition(now) - wrappedEl.element.currentTime;

        // Compute the new video drift rate
        wrappedEl.driftRate = 0.002;

        // Switch back to the current vector's velocity,
        // adjusted with the newly computed drift rate
        wrappedEl.vector.velocity = timingVector.velocity + wrappedEl.driftRate;
        wrappedEl.element.playbackRate = wrappedEl.vector.velocity;


      });
    };



    /**
     * React to timing object's changes, harnessing the controlled
     * elements to align them with the timing object's position and velocity
     */
    var onTimingChange = function () {
      cancelAmortizationPeriod();
      controlElements();
    };


    /**
     * Ensure media elements are aligned with the current timing object's
     * state vector
     */
    var controlElements = function () {
      // Do not adjust anything during an amortization period
      if (amortTimeout) {
        return;
      }

      // Get new readings from Timing object
      timingVector = timing.query();

      controlledElements.forEach(controlElement);

      var amortNeeded = false;
      controlledElements.forEach(function (wrappedEl) {
        if (wrappedEl.amortization) {
          amortNeeded = true;
        }
      });

      if (amortNeeded) {

        amortTimeout = setTimeout(stopAmortizationPeriod, settings.amortPeriod * 1000);
      }

      // Queue a task to fire a simple event named "timeupdate"
      setTimeout(function () {
        self.dispatchEvent({
          type: 'timeupdate'
        }, 0);
      });
    };


    /**
     * Ensure the given media element (wrapped in info structure) is aligned
     * with the current timing object's state vector
     */
    var controlElement = function (wrappedEl) {
      var element = wrappedEl.element;
      var diff = 0.0;
      var futurePos = 0.0;
    //  console.log("driftRate",wrappedEl.driftRate);

      if ((timingVector.velocity === 0.0) &&
          (timingVector.acceleration === 0.0)) {
        //logger.info('stop element and seek to right position');
        element.pause();
        element.currentTime=timingVector.position;
        wrappedEl.vector = new StateVector(timingVector);
      }
      else if (element.paused ) {
      //  logger.info('play video');
        wrappedEl.vector = new StateVector({
          position: timingVector.position,
          velocity: timingVector.velocity + wrappedEl.driftRate,
          acceleration: 0.0,
          timestamp: timingVector.timestamp
        });

        wrappedEl.seeked = true;
        wrappedEl.amortization = true;
        element.currentTime = wrappedEl.vector.position-element._offset;
        element.playbackRate = wrappedEl.vector.velocity;
        element.play();


      }
      else {
        var vel = wrappedEl.vector ? wrappedEl.vector.velocity: 0.95;
        wrappedEl.vector = new StateVector({
          position: element.currentTime,
          velocity:vel,
        });
        diff = timingVector.position - wrappedEl.vector.position - element._offset;
      //  console.log("diff",diff,"vel",wrappedEl.vector.velocity,"timing vel",timingVector.velocity,"offset",element._offset);
        if (Math.abs(diff) < settings.minDiff) {

        }
        else if (Math.abs(diff) > settings.maxDelay) {
          console.log("DIFF",diff);
          wrappedEl.vector.position = timingVector.position;
          wrappedEl.vector.velocity = timingVector.velocity + wrappedEl.driftRate;
          wrappedEl.seeked = true;
          wrappedEl.amortization = false;
          element.currentTime = wrappedEl.vector.position-element._offset;
          element.playbackRate = wrappedEl.vector.velocity;
        }
        else {
          futurePos = timingVector.computePosition(
            timingVector.timestamp + settings.amortPeriod);
          wrappedEl.vector.velocity =
            wrappedEl.driftRate +
            (futurePos - wrappedEl.vector.position) / settings.amortPeriod;
          wrappedEl.amortization = false;
          element.playbackRate=wrappedEl.vector.velocity;
        //  logger.info('new playbackrate={}', wrappedEl.vector.velocity);
        }
      }

    };


    /**********************************************************************
    Listen to the timing object
    **********************************************************************/

    timing.addEventListener('timeupdate', controlElements);
    timing.addEventListener('change', onTimingChange);


    timing.addEventListener('readystatechange', function (evt) {
      self.dispatchEvent(evt);
    });



  };


  // TimingMediaController implements EventTarget
  TimingMediaController.prototype.addEventListener = EventTarget().addEventListener;
  TimingMediaController.prototype.removeEventListener = EventTarget().removeEventListener;
  TimingMediaController.prototype.dispatchEvent = EventTarget().dispatchEvent;


export {TimingMediaController};
