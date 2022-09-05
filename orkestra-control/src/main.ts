import { enableProdMode, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';

import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

function bootstrapModule() {
  platformBrowserDynamic().bootstrapModule(AppModule,{providers: [{provide: LOCALE_ID, useValue: 'pt-Pt' }]})
    .catch(err => console.log(err));
}

  // Wait for polyfills to load
  //  setTimeout(()=> bootstrapModule(),1000);

if ((window as any).WebComponents.ready) {
  // Web Components are ready
  bootstrapModule();
} else {
  // Wait for polyfills to load
  window.addEventListener('WebComponentsReady', bootstrapModule);
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
