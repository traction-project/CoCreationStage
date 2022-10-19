/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
const host = "localhost";
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
  mediaVault:"https://"+host+"/encoding",
  cloudfront:"https://d2pjmukh9qywdn.cloudfront.net/",
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
