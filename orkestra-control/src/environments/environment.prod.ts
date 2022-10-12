const host = "192.168.1.136";
export const environment = {
  production: true,
  protocol:'https',
  janusIp:host,
  motionServer:host+":8080",
  motionChannel:"testing",
  sharedStateServer:host+":8082",
  sharedStateChannel:"traction22",
  controlServer:host+":8082",
  staticServer:host,
  mediaVault:"https://"+host+":3001/",
  cloudfront:" https://d2pjmukh9qywdn.cloudfront.net/",
  resolutions:["1080p","720p","480p","360p","240p","180p"],
  subdomains:["","https://d2pjmukh9qywdn.cloudfront.net/","https://stagem2.traction-project.eu/","https://stagem3.traction-project.eu/"],
  keycloak_app:"stage",
  publicPaths:['/assets', '/traction','/camera','/audio','/player','/api/upload/encode'],
  ytServer:"",
  ytPass:""
};



/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
