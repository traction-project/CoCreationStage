var assert = require('assert');
import { Subject,Observable } from 'rxjs';
import {Orkestra} from '../src/orkestra/orkestra';
import {TextData,KeyPress} from '../src/orkestra/instruments/';
import {Byname} from '../src/orkestra/rules/byname';
import {Divided} from '../src/orkestra/ui/plugins/divided';

describe('Orkestra', function() {
  var app = "";
  var app = new Orkestra({url:'https://dev.flexcontrol.net/',channel:'test',master:true})
  describe('New App Instance', function() {

    it('should return Orkestra instance', function() {
      assert.equal( app instanceof Orkestra,true);
    });
    it('should return user Observable', function() {
       assert.equal( app.userObservable  instanceof Observable,true);
    });
    it('should register data module', function(done) {
      app.readyObservable.subscribe(()=>{
       app.data('textShare',TextData,[{}]);
       var keys = app.me().keys();
       assert.notEqual( keys.indexOf('textShare'),-1);
       done();
    });
    })
  });
  describe('User Interface', function() {
    it('should register new deploy module', function() {
        app.use(Byname);
        assert.equal(app.rules.length,1);
    })
    it('should register new layout module', function() {
        app.ui(Divided);
        assert.equal(app.ui().layouts.length,1);
    })

  });
  describe('User control', function() {

    it('should be connected to aplicationContext', function(done) {
          app.readyObservable.subscribe((x)=>{
            assert.equal(app.appCtx.ready(),true);
            done();
        });
      });
    it('should be at least one user', function(done) {
        app.readyObservable.subscribe((x)=>{
          assert.equal(JSON.parse(app.getUsers()).me.name,'me');
          done();
      });
    })


  });
});
