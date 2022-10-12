#!/bin/bash
echo "Removing docker containers and images\n"
sudo docker-compose down
sudo docker image rm servers_orkestraserver -f
sudo docker image rm servers_motion -f
sudo docker image rm servers_static -f
sudo docker image rm servers_reverseproxy -f
sudo docker image rm quay.io/vicomtech/traction:janus -f
sudo docker image rm mongo -f
sudo docker image rm traction-encoding-api-production -f
rm images/*.tar.gz -f
echo "done"
