# How to run the frontend and backend

### Backend

1. execute this in terminal under project folder: `export FLASK_ENV=development`, which is for debugging and auto refresh
2. execute `python run.py` to start the backend server

### Frontend
1. open a new terminal
2. `cd frontend/` 
3. `npm start` to start the frontend
4. The frontend will be running at `localhost:3000` in browser


# How to deploy

### Get into the server and setup

1. Login to AWS server by `ssh -i <pem-file> <username>`
2. `sudo apt-get update` to update 
3. `git clone https://github.com/ProfWergeles/HorseQueryPortal.git` to clone the project


### Environment setup

1. `sudo apt-get install python3.6` to install python3
2. `sudo apt install python3-pip` to install pip3
3. `pip install Flask` to install Flask (if `pip` is not working, try `pip3 install Flask`)
4. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash` to install nvm
5. `source ~/.profile`
6. `nvm install stable` to install node
7. `sudo apt install nodejs npm` to install npm
8. `sudo apt install nginx` to install nginx


### Frontend setup

1. `cd HorseQueryPortal/frontend/` 
2. `npm run build` to build the frontend of the app


### Nginx setup

1. `cd /etc/nginx/sites-available/` 

2. `sudo vim default`

3. In the "server" section, change the root and location to be like following:
*Note: the root should be the build folder in the HorseQueryPortal folder* 
```
root /home/ubuntu/workspace/HorseQueryPortal/frontend/build;

# Add index.php to the list if you are using PHP
index index.html index.htm index.nginx-debian.html;

server_name _;

location / {
      # First attempt to serve request as file, then
      # as directory, then fall back to displaying a 404.
      try_files $uri /index.html;
}
```

4. append following to the location / section:
```
location /api/ {
    proxy_pass http://localhost:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

5. `sudo service nginx restart` to restart nginx

*By now, you should be able to see the frontend in the domain*


### Backend setup


1. `sudo apt install tmux` to install tmux to have the backend running after closing terminal
2. `tmux new -s <app name of your choice>` to create a new tmux session
3. cd into the project folder and do `python3 run.py` or `python run.py` to run the backend
4. By now everything should be running successfully

* `tmux ls` to check current running session
* `tmux kill-session -t <session-name>` to kill the current running session
*Everytime you update backend code, you should re run the backend service*

*DONE!!*


# How to update the live website

1. Push the most-updated code to github
2. ssh to the server and cd to the project repo
3. `git pull`
4. `cd frontend`
5. `npm run build`
6. `tmux kill-session -t <the session name created previously>` (you can do `tmux ls` to see the current runnung session)
7. `tmux new -s <create a session name of your choice>`
8. In the project repo, do `python3 run.py` or `python run.py` to run the backend
9. After above steps, you can close the terminal and the service will still be runnung on live server.

*DONE!!*