import express, {json} from "express"
import {WebSocketServer} from "ws"
import cors from "cors"
const app = express()
const port = 3000
const playerIds = new Set()
const decoder = new TextDecoder()


app.use(express.json())
app.use(cors())

const games = new Map()

const Status = {
  Waiting: "waiting"
}

function getGenerator(check, length = 6, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  return function generate() {
    let result = '';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    if (check(result)) {
      return generate(length);
    }
    return result;
  }
}

const getRoomId = getGenerator((result) => games.values().find(id => id === result));
const getSocketId = getGenerator((result) => playerIds.values().find(id => id === result))


app.post('/challenge', (req, res) => {
  const id = getRoomId()
  const challenger = req.body.challenger
  games.set(id, {
    challenger: challenger,
    status: Status.Waiting
  });
  res.json({id: id}).status(201)
})

const server = app.listen(port, () => {
  console.log(`server listening at port: ${port}`)
})

const wss = new WebSocketServer({server})
let spectator;
let player;
let name;

wss.on('connection', function connection(ws, client) {
  ws.on("message", (body) => {
    // const data = JSON.parse(decoder.decode(body));
    // if(data.type === "register") {
    //   const gameId = data.gameId
    //   const game = games.get(gameId)
    //   game.challengerClient = client
    //   games.set(gameId, game)
    // }
    // if (data.type === "join") {
    //   const gameId = data.gameId
    //   const game = games.get(gameId)
    //   game.opponentClient = client
    //   games.set(gameId, game)
    //   game.challengerClient.send(JSON.stringify({type: "start"}))
    //   game.opponentClient.send(JSON.stringify({type: "start"}))
    // }

    const command = decoder.decode(body).split(":")
    const action = command[0]
    console.log(action)

    if (action === "spectate") {
      spectator = ws
      if (player) {
        player.send("start")
        spectator.send("start")
        spectator.send(`name:${name}`)
      }
    } else if (action === "player") {
      player = ws
      name = command[1]
      if (spectator) {
        player.send("start")
        spectator.send("start")
        spectator.send(`name:${name}`)
      }
    }

    if (spectator && player) {
      spectator.send(action)
    }
  })

})

wss.on("connection", (ws) => {})