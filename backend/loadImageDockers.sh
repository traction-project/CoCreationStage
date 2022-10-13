#!/bin/bash
docker load < images/traction_janus.tar.gz
docker load < images/traction_motion.tar.gz
docker load < images/traction_orkestraserver.tar.gz
docker load < images/traction_reverseproxy.tar.gz
docker load < images/traction_static.tar.gz 
docker load < images/traction_endoningapi.tar.gz
