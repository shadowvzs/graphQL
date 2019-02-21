#!/bin/bash
sudo docker run -v /home/shadowvzs/projects/graphql/nodejs/:/home/project/nodejs -v /home/shadowvzs/projects/graphql/frontend/:/home/project/frontend -it --rm -p 4000:4000 -p 8000:8000 -p 3000:3000 --network mynetwork --privileged --name nodejs nodejs:1 /bin/bash
