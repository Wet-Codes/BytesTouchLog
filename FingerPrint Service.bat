@echo off
cd fingerprint_service
docker-compose down
docker-compose build
docker-compose up
pause