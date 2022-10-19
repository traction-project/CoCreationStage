/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
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
