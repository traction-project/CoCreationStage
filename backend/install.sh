#!/bin/bash
echo "Removing old images..."
sh unLoadImageDockers.sh
echo "Loading images to docker system...\n"
sh loadImageDockers.sh
