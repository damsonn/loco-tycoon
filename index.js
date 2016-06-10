import { send, json } from 'micro'
import minimax from './lib/minimax'
import _ from 'lodash'

// return the next moves for a give state
const play = ({ planes, airports, routes, loyalty, players, currentPlayer }) => {
  const leaving = (airport) => _.filter(routes, {start: airport})
  const pickBest = (flights) => _.maxBy(flights, 'flightValue')

  const myPlanes = _.filter(planes, {owner: currentPlayer})

  const moves = _.map(myPlanes, (plane) => {
    const availableFlights = leaving(plane.location)
    const bestFlight = pickBest(availableFlights)
    return {
      name: plane.name,
      location: bestFlight.name
    }
  })
  return moves
}

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
  return play(state)
}
