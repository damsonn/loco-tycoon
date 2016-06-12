import _ from 'lodash'

const PLANE_COST = 500

class Game {
  constructor(state) {
    // { planes, airports, routes, loyalty, players, currentPlayer }
    this.attrs = state
  }

  currentPlayer() {
    return this.find('players', {name: this.attrs.currentPlayer})
  }

  find(collection, match) {
    return _.find(this.attrs[collection], match)
  }

  score() {

  }

  win() {

  }

  flyPlane(planeName, routeKey) {
    const player = this.currentPlayer()
    const plane = this.find('planes', {name: planeName})
    const route = this.find('routes', {key: routeKey})

    plane.flights_flown++
    plane.location = route.end

    player.money += route.flightValue

    this.addReward(player, plane, route)
  }

  addReward(player, plane, route) {
    const destAirport = this.find('airports', {name: route.end})
    const loyalty = this.find('loyalty', {location: destAirport.name, owner: player.name})

    if(destAirport.owner != player.name) {
      loyalty.amount += 20
      if(loyalty.amount >= 100) {
        destAirport.owner = player.name
        _(this.attrs.loyalty).filter({location: destAirport.name}).each(l => l.amount = 0)
      }
    }
  }

  buyPlane() {
    const player = this.currentPlayer()
    console.log("---------------------------------------------------------------------------------")
    console.log("buying one place for player")
    console.log(JSON.stringify(player))
    console.log("---------------------------------------------------------------------------------")
    player.money -= PLANE_COST
    const rnd = Math.random().toString(36).replace(/[^0-9a-f]+/g, '').substr(0, 6)
    this.attrs.planes.push({
      name: "Plane-#{rnd}",
      flights_flown: 0,
      location: player.hq,
      owner: player.name
    })
  }

  // returns a new game based on the moves
  next(moves) {
    const nextGame = this.clone()
    nextGame.moves = moves

    const player = nextGame.currentPlayer()

    // fly planes
    for (const {name, location} of moves) {
      nextGame.flyPlane(name, location)
    }

    // buy planes
    const planesToBuy = Math.floor(player.money / PLANE_COST)
    _.times(planesToBuy, () => nextGame.buyPlane())

    return nextGame
  }

  clone() {
    return new Game(_.cloneDeep(this.attrs))
  }
}

export default Game;
