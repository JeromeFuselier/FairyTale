# FairyTale Web Interface

## Install on Windows

### Install Node.js runtime

Get and install version 8.12.0 LTS from https://nodejs.org/en/

This will create a "Node.js Command Prompt" entry in the Windows Menu that has
to be used for command line operations.

Install express module, in command line

`npm install express`

### Get FairyTale interface

Get the FairyTale interface from https://github.com/JeromeFuselier/FairyTale/archive/master.zip

Unzip the interface somewhere.

### Execute FairyTale interface

Using "Node.js Command Prompt" go to the folder where the archive has been unzipped (cd `Downloads\FairyTale-master`)

`node server.js`

-> This will run a server, use a web browser and navigate to http://localhost:8081/fairy

## Modify the database

The "database" is stored in a text file "db.json" in the folder "db".

For each button you need:
  - x/y coordinates on the map
  - txt: The text that is displayed next to the button when it's clicked
  - img: The image displayed below the text when the button is clicked. It's a filename of an image, the image has 
         to be stored in the folder "db\img" so the interface can find it.
