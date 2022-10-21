class ObjectSync {
  constructor(){
    this.currentTime=0.0;
    this.playbackRate=1.0;
    this.paused=true;
    this.offset=0;
  }

  pause (){
    // TODO pause
    console.log("TODO");
  }
  play (){
    // TODO play
    console.log("TODO");
  }
  seekTo (time){
    // TODO play
    console.log("TODO");
  }
  setPlaybackRate(rate){
    this.playbackRate = rate;
  }
  incPlayBacRate(){
    this.playbackRate+=0.3;
  }
  decPlayBacRate(){
    this.playbackRate-=0.3;
  }
}
export {ObjectSync}
