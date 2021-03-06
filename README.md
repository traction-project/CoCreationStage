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

### Start

```note

By default clients are point to an Amaazon server, so there is not need to run server locally.

```

```bash

# git clone git@github.com:tv-vicomtech/CoCreationStage.git
# cd CoCreationStage && npm run build:local
```

Open http://localhost:4200
### Configuration files

* Orkestra-control [config](https://github.com/tv-vicomtech/CoCreationStage/blob/dev/orkestra-control/src/environments/environment.ts)
* OrkestraApp [config](https://github.com/tv-vicomtech/CoCreationStage/blob/dev/orkestraApp/src/config/environmet.js)
