#!/bin/bash
echo "Downloading images...\n"
cd images
echo "Downloading traction:janus image...\n"
wget -q https://www.dropbox.com/s/mszne1m51fjtz00/traction%3Ajanus.tar.gz?dl=0 -O traction_janus.tar.gz
echo "Downloading traction:motion image...\n"
wget -q https://www.dropbox.com/s/uwwnhgrlut4pjnk/traction%3Amotion.tar.gz?dl=0 -O traction_motion.tar.gz
echo "Downloading tracion:orkestraServer image...\n"
wget -q https://www.dropbox.com/s/k74cn2pfszlnzj2/traction%3Aorkestraserver.tar.gz?dl=0 -O traction_orkestraserver.tar.gz 
echo "Downloading tracion:reverseproxy image...\n"
wget -q https://www.dropbox.com/s/gvjt9lqb6s5z4eh/traction_reverseproxy.tar.gz?dl=0 -O traction_reverseproxy.tar.gz
echo "Downloading tracion:staticServer image...\n"
wget -q https://www.dropbox.com/s/hqsl29ojj42986w/traction%3Astatic.tar.gz?dl=0 -O traction_static.tar.gz
echo "Downloading tracion:encoding api image...\n"
wget -q https://www.dropbox.com/s/l0ttvx15vdvpl47/traction_endoningapi.tar.gz?dl=0 -O traction_endoningapi.tar.gz
echo "unLoading existing image at docker system...\n"
cd ..
sh unLoadImageDockers.sh
echo "Loading images to docker system...\n"
sh loadImageDockers.sh
echo "Composing dockers.."
docker-compose up
