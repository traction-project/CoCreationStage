#!/bin/bash
sudo docker load < images/traction_janus.tar.gz
sudo docker load < images/traction_motion.tar.gz
sudo docker load < images/traction_orkestraserver.tar.gz
sudo docker load < images/traction_reverseproxy.tar.gz
sudo docker load < images/traction_static.tar.gz 
sudo docker load < images/traction_endoningapi.tar.gz
