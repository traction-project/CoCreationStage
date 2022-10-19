const host = "localhost";
export const environment = {
  production: true,
  protocol:'https',
  janusIp:host,
  motionServer:host+":8082",
  motionChannel:"testing",
  sharedStateServer:host+":8083",
  sharedStateChannel:"traction22",
  controlServer:host+":8083",
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
