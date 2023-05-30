const express = require('express');
const app = express();
const http = require('node:http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

const sockets = [

];

class GameWorld {
    state = {
        entities: [],
    };
    loopIntervalId = null;

    spawnPlayer(id) {
        this.state.entities.push({
            name: id,
            x: 10,
            y: 10,
            color: '#000',
            rotation: 0,
        });
    }

    removeEntity(name) {
        this.state.entities = this.state.entities.filter(e => e.name !== name);
    }

    applyUserControls(playerName, controls) {
        const { rotation, x, y, name } = controls;
        const index = this.state.entities.findIndex(e => e.name === name);

        if (index === -1) return;

        this.state.entities[index].rotation = rotation;
        this.state.entities[index].x = x;
        this.state.entities[index].y = y;
    }

    startGameLoop() {
        this.loopIntervalId = setInterval(() => {
            
        }, 1000 / 10);
    }

    stop() {
        clearInterval(this.loopIntervalId);
    }
}

const gameWorld = new GameWorld();
// gameWorld.startGameLoop();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('auth', (name) => {
        socket.name = name;
        gameWorld.spawnPlayer(name);
        io.emit('world:update', gameWorld.state);
    });

    socket.on('user:controls', (controls) => {
        if (!socket.name) return;

        gameWorld.applyUserControls(socket.name, controls);

        io.emit('world:update', gameWorld.state);
    });

    socket.on('disconnect', () => {
        gameWorld.removeEntity(socket.name);
        io.emit('world:update', gameWorld.state);
    });
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});
