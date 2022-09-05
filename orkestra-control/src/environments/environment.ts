// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  protocol:'https',
  janusIp:"stage.traction-project.eu",
  jetsonIp:"192.168.15.141",
  motionServer:"devstage.traction-project.eu",
  motionChannel:"testing",
  sharedStateServer:"devstage.traction-project.eu:8083",
  sharedStateChannel:"traction22",
  controlServer:"devstage.traction-project.eu:8083",
  mediaVault:"https://space.traction-project.eu/",
  cloudfront:"https://d2pjmukh9qywdn.cloudfront.net/",
  resolutions:["1080p","720p","480p","360p","240p","180p"],
  subdomains:["","https://d2pjmukh9qywdn.cloudfront.net/","https://stagem2.traction-project.eu/","https://stagem3.traction-project.eu/"],
  staticServer:"localhost:4200",
  keycloak_app:"devstage",
  publicPaths:['/assets', '/traction','/camera','/audio','/player'],
  ytServer:"https://cloud.flexcontrol.net:4200",
  ytPass:"dkeiomkdoleeeksEW_222"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
