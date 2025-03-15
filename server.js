import express, {json} from "express"
import ws from "ws"
import cors from "cors"
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

const games = new Map()

const Status = {
  Waiting: "waiting"
}

function makeid(length = 6) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  if (games.has(result)) {
    return makeid(length);
  }
  return result;
}


app.post('/challenge', (req, res) => {
  const id = makeid()
  const challenger = req.body.challenger
  games.set(id, {
    challenger: challenger,
    status: Status.Waiting
  });
  res.json({id: id}).status(201)
})

app.listen(port, () => {
  console.log(`server listening at port: ${port}`)
})



