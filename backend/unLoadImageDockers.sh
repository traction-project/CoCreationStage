#!/bin/bash
docker image rm servers_motion -f
docker image rm servers_static -f
docker image rm servers_orkestraserver -f
docker image rm quay.io/vicomtech/traction:janus -f
docker image rm servers_reverseproxy -f
docker image rm traction-encoding-api-production -f
