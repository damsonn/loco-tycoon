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
export function calcScore(game, scoringPlayer) {
  const ownedAirports = _.filter(game.attrs.airports, {owner: scoringPlayer.name})
  const loyalties = _.filter(game.attrs.loyalty, {owner: scoringPlayer.name})
  const totalLoyalty = _.sumBy(loyalties, 'amount')
  return (ownedAirports.length * 1000) + totalLoyalty
}

export default function(state) {
  const game = new Game(state)

  const ai = game.currentPlayer()
  ai.startScore = Number.NEGATIVE_INFINITY
  ai.best = _.maxBy

  const opponent = game.otherPlayer()
  opponent.startScore = Number.POSITIVE_INFINITY
  opponent.best = _.minBy
  
  // return the other player
  const other = (player) => player === ai ? opponent : ai

  // easiest way to get the move is to have a block variable
  let currentBestMove

  // returns the best game ( contains move and score )
  const calcMinimax = (game, depth, player) => {
    game.setCurrentPlayer(player)
    if(depth === 0 || game.isTerminal()) {
      return calcScore(game, ai)
    }
    const bestScore = player.startScore
    const nodes = generateMoves(game).map((move) => {
      const score = calcMinimax(game.next(move), depth -1, other(player))
      return { score: score, move: move}
    })
    const bestNode = player.best(nodes, 'score')
    currentBestMove = bestNode.move
    return bestNode.score
  }

  calcMinimax(game, MAX_DEPTH, ai)

  return currentBestMove
}
