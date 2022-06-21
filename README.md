# Battleship Server

Server that handles [Battleship](https://en.wikipedia.org/wiki/Battleship_(game)) (also known as Sea Battle) game.
Newest version of web client can be found [here](https://github.com/KT-Trez/battleship_client).

# How to run

1. Install the latest version of Node.js
2. Install dependencies with npm install
3. Build project with `npm run build`
4. Download the latest static files from [here](https://github.com/KT-Trez/battleship_client/releases) and put them in
   the [public](./public) directory.
5. Start app with `npm run start`
6. At default, app runs at http://localhost:3000

# Optional config

You can customize server settings by changing values of the `config` variable in [config file](./src/config.ts).

```js
const config = {
    Engine: {
        // max time of the player's turn in ms
        turnMaxTime: 60000
    },
    // list of default ships for each player
    ShipsList: [
        {
            length: 4,
            quantity: 1
        }
        // ...
    ]
};
```

> Warning  
> Although it is possible to change the default ships' composition, for the time being it's highly not recommended and
> may lead to many errors.
>
> However, if you choose to do so, remember to also edit composition in
> client's [config](https://github.com/KT-Trez/battleship_client#optional-config).

Optional `.env` config.

```dotenv
# to disable development mode, remove the variable below
DEVELOPMENT
# servers's port
SERVER_PORT=5000
# origin of 'Access-Control-Allow-Origin' in cors rules; default: '*'
WEB_ORIGIN='http://localhost:3000'
```

# Scripts

- `npm run build` - compiles typescript files
- `npm run build-watch` - compiles typescript files and watches for changes
- `npm run start` - starts app
- `npm run start-deamon` - starts app and watches for changes