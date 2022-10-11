#!/bin/bash
sudo docker load < images/traction:janus.tar.gz
sudo docker load < images/traction:motion.tar.gz
sudo docker load < images/traction:orkestraserver.tar.gz
sudo docker load < images/traction:reverseproxy.tar.gz
sudo docker load < images/traction:static.tar.gz 
