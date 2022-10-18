#!/bin/bash
echo "Downloading images...\n"
cd images
echo "Downloading traction:janus image...\n"
wget -q https://vicomtech.box.com/s/tpcuin4h7gjza4x27swo3rkumzxo39jz -O traction_janus.tar.gz
echo "Downloading traction:motion image...\n"
wget -q https://vicomtech.box.com/s/0i7bnbqfsbivttixilv3i0hjshlisa1x -O traction_motion.tar.gz
echo "Downloading traction:orkestraServer image...\n"
wget -q https://vicomtech.box.com/s/h13r9st9bncysgl2qo7ib273eno5633e -O traction_orkestraserver.tar.gz 
echo "Downloading traction:reverseproxy image...\n"
wget -q https://vicomtech.box.com/s/wh07ej7jwrgftiriohw1xjss45c0rjs6 -O traction_reverseproxy.tar.gz
echo "Downloading traction:staticServer image...\n"
wget -q https://vicomtech.box.com/s/heejadeqpkxyhai4cnkbdnuo72n133zx -O traction_static.tar.gz
echo "Downloading traction:encoding api image...\n"
wget -q https://vicomtech.box.com/s/ln166k8e6kqgdkth9ludpq4l28st6cxb -O traction_encodingapi.tar.gz
echo "unLoading existing image at docker system...\n"
cd ..
sh unLoadImageDockers.sh
echo "Loading images to docker system...\n"
sh loadImageDockers.sh
echo "Composing dockers.."
docker-compose up
