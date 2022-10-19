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

- Nodejs v14.18.1
- Npm
- Docker-ce
- Docker-compose
- (Optional) AWS Account

## Ports

The CoCreationStage is composed of many services that use the following ports:

* 443 (reverse proxy)
* 80
* 8080 (motion)
* 8082 (orkestra-server)
* 3001 (encoding api)
* 8089,8989 (janus, webrtc gateway)


## Deployment

1. Clone the project repository:

    ```bash
    git clone git@github.com:traction-project/CoCreationStage.git
    cd CoCreationStage
    ```
2. The application use several services and servers. This servers runs inside Docker containers. We need download the docker images from [here](https://vicomtech.box.com/s/54gumjw56s05ps5dcg67dmpa1oet3qhx). 
    
    After download the files, move them to **backend/images** folder. 

3. Install the docker images downloaded with the next script:

    ```bash
    cd backend
    sh install.sh
    ```

    (Optional) If you want to remove this images later, you can execute:

    ```bash
    cd backend
    sh uninstall.sh
    ```

4. Run the docker containers using the following commands:

    ```bash
    cd backend
    docker-compose up -d
    ```

    (Optional) In case it is neccessary to stop the services, the commands are the following:

    ```bash
    cd backend
    docker-compose down
    ```


5. (Optional) **Encoding  API**. In case you want to use pre-recorded content as multimedia files, follow the steps specified in [Install Encoding API](#encoding-api) section in order to configure it. 

6. Configure the host or IP where will be deploy the application (by default is localhost):

    -  Configure the *host* variable at Orkestra-control [config](https://github.com/tv-vicomtech/CoCreationStage/blob/dev/orkestra-control/src/environments/environment.ts) file. 
      
    -  Configure the *host* variable at OrkestraApp [config](https://github.com/tv-vicomtech/CoCreationStage/blob/dev/orkestraApp/src/config/environmet.js) file. 

7. Compile the application:

    ```bash
    npm run build
    ```

8. Once it's done, the application will be available at the following URL:

    https://YOURHOST/ (Where YOURHOST is the IP or domain specified in the step 6)
    

## Encoding API

The code of the service needed to host all the pre-recorded content and the guidelines to deploy it can be found [here](https://github.com/traction-project/encoding-api). But in this case docker image is provided, so the only thing you need is follow the next steps:

-  This service use a Elastic Transcoder pipeline from AWS to transcode the multimedia files in several formats and reslutions and a S3 Bucket to store this transcoded files. To configure this services, we need to configure the AWS Credentials in [aws.json](https://github.com/traction-project/CoCreationStage/blob/feature/local/backend/aws.json) and  [.env](https://github.com/traction-project/CoCreationStage/blob/feature/local/backend/.env) following the next documentation: [link](https://github.com/traction-project/encoding-api#setup): 

- The application uses specific user credentials to do the authentication in this service. We need to create this user before running the application. To create it, we need to run the next command in the **backend** folder:

    ```bash
    cd backend
    docker compose exec encodingapi yarn register
    ```

    After run this command, it will ask about a username and password. The username must be **test** and the password **1234**


## License
<img src="https://www.gnu.org/graphics/lgplv3-147x51.png" align="left"/>
<em> This tool is published under the license LGPL - V3. A copy of the GNU Lesser General Public License can be found <a href="https://github.com/traction-project/CoCreationStage/blob/master/licenseLGPL.txt" >here</a>.</em> <br><br>

## Experiment

We are aware that the deployment of the CoCreationStage with all its functionalities is not immediate. However, if you would like to carry out an experiment with the CoCreationStage in a real event, do not hesitate to contact [Vicomtech](https://www.vicomtech.org/) at mzorrilla@vicomtech.org. 
