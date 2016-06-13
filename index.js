import { send, json } from 'micro'
import minimax from './lib/minimax'
import _ from 'lodash'

const cors = (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "POST")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept")
  if (req.method === 'OPTIONS') {
    send(res, 200)
  }
}

export default async function (req, res) {
  cors(req, res)
  const state = await json(req)
  console.log('recieved payload')
  console.log(JSON.stringify(state))
  console.time('minimax')
  const bestMove = minimax(state)
  console.timeEnd('minimax')
  return bestMove
}
