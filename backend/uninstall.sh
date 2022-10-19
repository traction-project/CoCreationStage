#!/bin/bash
echo "Stopping docker containers\n"
docker-compose down
echo "Done!"
echo "Removing docker images\n"
sh unLoadImageDockers.sh
echo "Done!"
echo "Removing .tar.gz files\n"
rm images/*.tar.gz -f
echo "done"
