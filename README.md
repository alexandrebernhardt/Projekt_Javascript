# READ ME - JavaScript Project 2017

## Project Team :
##### Bernhardt Alexandre - Projektleiter/Javascript
##### Séné Pierre - SQL/HTML/Javascript
##### Coltel Morgane - CSS Stylesheets
##### Chevrolat Alexandre - Unit Tests
##### Mbongning T George Francis - Unit Tests
##### Steinbach Sébastien - Documentation

## Instructions to launch the app :
### Open a terminal (see shortcut below) :
```
CTRL + ALT + t
```

### Install MySQL, node.js, node legacy and npm :
```
sudo apt install mysql-server node nodejs-legacy npm
```

### Install the modules we're going to need to run the app :
```
npm install
```

### Launch MySQL as root :
```
sudo mysql -p
```

##### Within MySQL, create the dabase using this single command :
```
source <path_to_folder>/lib/thermometer.sql;
```

##### You can now leave MySQL :
```
exit;
```

### Go inside our application's folder :
```
cd <path_to_folder>
```

### Enter the following command to run the app :
```
node server.js
```

### If the terminal says "server started successfully", just open your favorite web browser and go to :
http://localhost:8080/
