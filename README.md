# TRACTION Co-Creation Stage

This repository contains the CoCreation Stage code for the TRACTION EU-project. The CoCreation Stage is a web based tool that enables distributed performances connecting different stages and people. It is a JavaScript and TypeScript based tool using Angular framework for the frontend and different services at the backend. 

At the client side, CoCreationStage is composed of two applications that use [Orkestralib library](https://github.com/tv-vicomtech/Orkestralib) (LGPL-V3) to enable multi-device and multi-user mechanisms. Those applicartions are:

* [OrkestraControl](https://github.com/traction-project/CoCreationStage/tree/master/orkestra-control) is the application for artists to create a template for their show, defining beforehand a number of scenes, the number of stages, the screens/displays/projectors/devices at each stage and audio-visual assets including live and pre-recorded content. 
* [OrkestraApp](https://github.com/traction-project/CoCreationStage/tree/master/orkestraApp), is the application for remote participants and viewers to follow the show. It allows to visualise all the content and also to share signal of the camera of the device being used in real time.

At the server side, CoCreationStage makes use of four different services:

* [Orkestra-server](https://github.com/tv-vicomtech/orkestra-server), to organise and maintain multi-device sessions and the shared data coherently.
* [Janus](https://github.com/tv-vicomtech/janusgw), to manage all the WebRTC media flows.
* [Motion server](https://github.com/tv-vicomtech/motionServer) to allow the syncronisation of the content, both in a single device or between multiple devices.  
* [Encoding API for Co-Creation Stage](https://github.com/traction-project/encoding-api) to upload the pre-recorded content to be consumed.  


<br><br>
<img src="https://www.traction-project.eu/wp-content/uploads/sites/3/2020/02/Logo-cabecera-Traction.png" align="left"/><em>This tool was originally developed as part of the <a href="https://www.traction-project.eu/">TRACTION</a> project, funded by the European Commission’s <a hef="http://ec.europa.eu/programmes/horizon2020/">Horizon 2020</a> research and innovation programme under grant agreement No. 870610.</em><br><br><br><br>


## Documentation

The documentation is available here: https://traction-project.github.io/CoCreationStage

## Prerequisites

The deployment of the tool requires to have installed:

* Nodejs v14.18.1
* Npm
* Docker-ce
* Docker-compose

## Deployment

### Download
The first step to prepare the application will be to download the repository:

```bash
# git clone git@github.com:traction-project/CoCreationStage.git
# cd CoCreationStage
```

### Ports

The CoCreationStage is composed of many services that use the following ports:

* 443 (reverse proxy)
* 80
* 8080 (motion)
* 8082 (orkestra-server)
* 3001 (encoding api)
* 27001 (mongo)
* 8089,8989 (janus, webrtc gateway)

### Backend deployment

To install the server part, it is necessary to download all the Docker images available [here](https://vicomtech.box.com/s/54gumjw56s05ps5dcg67dmpa1oet3qhx) and put them in *backend\images* forlder. Then, the following script installs them:

```bash
# cd backend
# sh install.sh
```

To uninstall, you can execute:

```bash
# cd backend
# sh uninstall.sh
```

Next step is to deploy the backend using the following commands:
```bash
# cd backend
# docker-compose up
```

In case it is neccessary to stop the services, the commands are the following:

```bash
# cd backend
# docker-compose down
```

The code of the service needed to host all the pre-recorded content to be used and the guidelines to deploy it can be found [here](https://github.com/traction-project/encoding-api). But in this case docker image is provided and the only thing to do is to configure the following files as specified [here](https://github.com/traction-project/encoding-api#setup): 

* [aws.json](https://github.com/traction-project/CoCreationStage/blob/feature/local/backend/aws.json)
* [.env](https://github.com/traction-project/CoCreationStage/blob/feature/local/backend/.env)



### Frontend

To start the frontend, all we have to do is to configure the host to our local IP in the configuration files, transpile and deploy the code so that it is accessible through the backend.

* Configure the *host* variable at Orkestra-control [config](https://github.com/tv-vicomtech/CoCreationStage/blob/dev/orkestra-control/src/environments/environment.ts) file. 
   
* Configure the *host* variable at OrkestraApp [config](https://github.com/tv-vicomtech/CoCreationStage/blob/dev/orkestraApp/src/config/environmet.js) file. 

To transpile and deploy:

```bash
# cd CoCreationStage
# npm run build
```

Once it's done, go to the following URL to accept the Janus certificates:

https://YOURHOST:8089/janus

Then, the app will be available at the following URL:

https://YOURHOST/

## License
<img src="https://www.gnu.org/graphics/lgplv3-147x51.png" align="left"/>
<em> This tool is published under the license LGPL - V3. A copy of the GNU Lesser General Public License can be found <a href="https://github.com/traction-project/CoCreationStage/blob/master/licenseLGPL.txt" >here</a>.</em> <br><br>

## Experiment

We are aware that the deployment of the CoCreationStage with all its functionalities is not immediate. However, if you would like to carry out an experiment with the CoCreationStage in a real event, do not hesitate to contact [Vicomtech](https://www.vicomtech.org/) at mzorrilla@vicomtech.org. 
