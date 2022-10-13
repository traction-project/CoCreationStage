# TRACTION Co-Creation Stage

CoCreationStage is composed by [MultiDeviceServer](https://github.com/tv-vicomtech/orkestra-server),[TimerServer](https://github.com/tv-vicomtech/motionServer)
client library [Orkestra library](https://github.com/tv-vicomtech/Orkestralib), user application [OrkestraApp](https://github.com/tv-vicomtech/traction_RealTimePerformanceEngine/tree/master/orkestraApp) and [timeline editor](https://github.com/tv-vicomtech/traction_RealTimePerformanceEngine/tree/master/orkestra-control)

<img src="https://www.traction-project.eu/wp-content/uploads/sites/3/2020/02/Logo-cabecera-Traction.png" align="left"/><em>This tool was originally developed as part of the <a href="https://www.traction-project.eu/">TRACTION</a> project, funded by the European Commission’s <a hef="http://ec.europa.eu/programmes/horizon2020/">Horizon 2020</a> research and innovation programme under grant agreement No. 870610.</em>

## Documentation

The documentation is available here: https://traction-project.github.io/CoCreationStage

## Development

### Dependencies

* Nodejs. Required: v14.18.1
* Npm
* Docker-ce, docker-compose
* Linux

### Port

CoCreationStage is made up of many services and is a highly connected service, so it needs many ports to secure these connections.
Backend service ports:

  * 443 (reverse proxy)
  * 80
  * 8080 (motion)
  * 8082 (orkestra-server)
  * 3001 (enconde api)
  * 27001 (mongo)
  * 8089,8989 (janus, webrtc gateway)

It's good to know that janus uses connections against stun services, by default it uses google's so port 19302 tcp/udp. On the other hand, the udp ports from 20,000 to 40,000 are recommended to have open since they will be used to make peer to peer connections for webrtc.

### Start

The first step to prepare the application will be to download the repository:

```bash

# git clone git@github.com:traction-project/CoCreationStage.git
# cd CoCreationStage
```

CoCreationStage is made up of a server part (dockers) and a client part (frontend). The first thing we have to do is download the docker images that make up the server part and install them. To install the server part we will execute the following commands:

```bash

# cd backend
# sudo sh install.sh
```

> **NOTE:** The installation will take a few minutes, so be patient, it is only done once. There are 6 images downloaded as part of the server.

If you want to uninstall we will execute:

```bash

# cd backend
# sudo sh uninstall.sh
```

### Backend setup

You may want to manually start and stop it:

Start 

```bash

# cd backend
# sudo docker-compose up
```

Stop

```bash

# cd backend
# sudo docker-compose down
```

To start the frontend, all we have to do is transpile and deploy the code so that it is accessible through the backend:

### Configuration files

Once the installation of the backend is finished, we configure the frontend part. For this, some files must be adapted:

At Orkestra-control [config](https://github.com/traction-project/CoCreationStage/blob/feature/local/orkestra-control/src/environments/environment.prod.ts#L1) Change host variable for your own IP or domain, example host:"192.168.194"

At OrkestraApp [config](https://github.com/traction-project/CoCreationStage/blob/feature/local/orkestraApp/src/config/environmet.js#L1) Change host
variable for your own IP or domain, example host:"192.168.194"

#### Encoding & Uploading services

The file upload and transcoding service depends on Amazon cloud services, so it is necessary to configure certain services for this service to work. To do this, the following files must be modified:

[aws configuration](https://github.com/traction-project/CoCreationStage/blob/feature/local/backend/aws.json)
[bucket configuration](https://github.com/traction-project/CoCreationStage/blob/feature/local/backend/.env)

### Frontend setup

To start the frontend, all we have to do is transpile and deploy the code so that it is accessible through the backend. Jump to root folder of the repository:

```bash

# cd CoCreationStage
# sudo npm run build
```

Once it's done, the app will be available at the following URL:

https://YOURHOST/
