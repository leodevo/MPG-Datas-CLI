# MPG-Datas-CLI

Node.JS CLI for the fantasy football game "Mon Petit Gazon".
Display players datas according to user inputs.

This CLI can be used in two ways :
- **'external' mode :** performs as a stand-alone client (interacts with a server)
- **'local' mode :** interacts directly with a local DB

*PS : to be used in 'local' mode, users should first extract datas using the script from the following project : leodevo/MPG-Datas-Extraction*

## Getting Started

Clone the repo : 

```
git clone https://github.com/leodevo/MPG-Datas-CLI
```

To install :

```
npm i
```

## Usage :

To sign up use 's' argument :

```
npm start -- -s 
```

To login, no argument is required  (login triggered by default)

```
npm start
```

To login faster, you can provide the email used for the signup with the '@' argument :
```
npm start -- -@=<yourEmail>
```

To show options :
```
 npm start -- --help
```

## Demo : 
![](MPG-Datas-CLI-demo.gif)

# What I Learned

* Node.JS CLI with inquirer.js & yargs.js
* Querying a REST API
* MongoDB basics
* Mongoose queries
