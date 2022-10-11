#!/bin/bash
sudo docker image rm servers_motion -f
sudo docker image rm servers_static -f
sudo docker image rm servers_orkestraserver -f
sudo docker image rm quay.io/vicomtech/traction:janus -f
sudo docker image rm servers_reverseproxy -f

