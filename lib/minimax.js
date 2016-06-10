import _ from 'lodash'
import alphabeta from 'alphabeta'

// This is the implementation of minimax for loco tycoon - see https://en.wikipedia.org/wiki/Minimax
// https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning
const DEPTH = 3
const MAX_TIME = 5000

const my = (coll, state) =>  _.filter(coll, {owner: state.currentPlayer})
const their = (coll, state) => _.reject(coll, {owner: state.currentPlayer})

const myPlanes = (state) => my(state.planes, state)

// maybe we should limit if too long
export function cartesianProduct(arr) {
  return _.reduce(arr, (a, b) => {
    return _.flatten(_.map(a, (x) => {
      return _.map(b, (y) => x.concat([y]))
    }), true)
  }, [ [] ])
}

// Must return a list of states or the empty list '[]' if no moves are available
export function generateMoves(state) {

}

// Must return falsy if not a win condition, truthy otherwise
export function checkWinConditions(state) {

}

// returns a score representing the current state
// based on world dominance
// second is money ?
export function score(state, cb) {
  //myAirports =
}

// generateMoves can create dup. This will prune them
// will only check currentPlayer planes locations
export function uniqueKey(state) {
  const locations = _.map(myPlanes(state), 'location')
  return _.sortBy(locations).join('') // 'DUBMELMEL'
}




export default function(state) {
  const { planes, airports, routes, loyalty, players, currentPlayer } = state
  // flights leaving a particular airport
  const flightsAvailable = (plane) => _(routes).filter({start: plane.location}).map('key').value()
  // create a move

  const myPlanes = _.filter(planes, {owner: currentPlayer})

  const possibleFlights = _.map(myPlanes, (plane) => {
    return _.map(flightsAvailable(plane), (key) => {
      return { name: plane.name, location: key}
    })
  })
  console.log(`possibleFlights :${JSON.stringify(possibleFlights)}`)

  /*
  *
  *
  */
  const possibleMoves = cartesianProduct(possibleFlights)
  console.log(`moves :${JSON.stringify(moves)}`)

  const matrix = []
  // _.each(availableFlights, ([plane, flights]) => {
  //   const moves = []
  //   _.each(flights, (f) => {
  //     //if (a !== b) {
  //     moves.push(move(plane, f))
  //     //}
  //   })
  //   matrix.push(moves)
  //   _.each(flights, (f) => {
  //     move(plane, f)
  //   })
  // })
  //
  // // 2d matrix of possible moves
  // // size of inner array is always the number of planes
  // const possibleMoves =
  // const combine = (acc, flight)
  // const combination = _.reduce(possibleMoves, ())

}
