import _ from 'lodash'

import Game from './game'

// This is the implementation of minimax for loco tycoon - see https://en.wikipedia.org/wiki/Minimax
// TODO implement alpha beta pruning
// https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning

const MAX_DEPTH = 1 // TODO should be at least 3 :-)
const MAX_TIME = 5000 // TODO implement that

// maybe we should limit if too long
export function cartesianProduct(arr) {
  return _.reduce(arr, (a, b) => {
    return _.flatten(_.map(a, (x) => {
      return _.map(b, (y) => x.concat([y]))
    }), true)
  }, [ [] ])
}

// return a list of moves for a specific game
export function generateMoves(game) {
  // flights leaving a particular airport
  const flightsAvailable = (plane) => _(game.attrs.routes).filter({start: plane.location}).map('key').value()
  // list of possible plane => route key
  const possibleFlights = _.map(game.my('planes'), (plane) => {
    return _.map(flightsAvailable(plane), (key) => {
      return { name: plane.name, location: key }
    })
  })

  let possibleMoves = cartesianProduct(possibleFlights)
  // remove duplicates moves
  possibleMoves = _.uniqBy(possibleMoves, (move) => _(move).map('location').sortBy().value())
  return possibleMoves
}


// returns a score representing the current state
// based on world dominance
// is spread the most important ?
// second is money ?
// TODO improve this
export function calcScore(game, ai, opponent) {
  // if(game.isWin(scoringPlayer)) {
  //   return Number.POSITIVE_INFINITY
  // }
  // if (game.isLost(scoringPlayer)) {
  //   return Number.NEGATIVE_INFINITY
  // }
  const ownedAirports = game.his('airports', ai)

  const loyalties = game.his('loyalty', ai)
  const totalLoyalty = _.sumBy(loyalties, 'amount')

  // give extra to getting airport from opponent
  const opponentAirportKeys = _.map(game.his('airports', opponent), 'key')
  const loyaltiesOpAirports = _.filter(loyalties, (l) => _.includes(opponentAirportKeys, l.location))
  const totalLoyaltyOpAirports = _.sumBy(loyaltiesOpAirports, 'amount')

  return (ownedAirports.length * 1000) + totalLoyalty + totalLoyaltyOpAirports
}

export default function(state) {
  const game = new Game(state)

  // limit depth based on planes
  const numberOfPlanes = game.attrs.planes.length
  let variable_depth = MAX_DEPTH
  if(game.attrs.planes.length > 20) {
    variable_depth = 1
  }
  console.log(`number of planes in game ${numberOfPlanes}`)
  let scoreCalculated = 0

  const ai = game.currentPlayer()
  const opponent = game.otherPlayer()

  // easiest way to get the move is to have a block variable
  let currentBestMove

  // returns the best game ( contains move and score )
  const calcMinimax = (game, depth, player, alpha, beta) => {
    game.setCurrentPlayer(player)
    if(depth === 0 || game.isTerminal()) {
      scoreCalculated++
      return calcScore(game, ai, opponent)
    }
    if (player === ai) {
      for(let move of generateMoves(game)) {
        const score = calcMinimax(game.next(move), depth-1, opponent, alpha, beta)
        if (score > alpha) {
          alpha = score
          currentBestMove = move // block assign
        }
        if (alpha >= beta) break
      }
      return alpha
    } else {
      for(let move of generateMoves(game)) {
        const score = calcMinimax(game.next(move), depth-1, ai, alpha, beta)
        if (score < beta) beta = score
        if (alpha >= beta) break
      }
      return beta
    }
  }

  calcMinimax(game, variable_depth, ai, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)

  console.log(`total number of score calculated : ${scoreCalculated}`)
  return currentBestMove
}
