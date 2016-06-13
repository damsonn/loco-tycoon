import _ from 'lodash'

const PLANE_COST = 500

class Game {
  constructor(state) {
    // { planes, airports, routes, loyalty, players, currentPlayer }
    this.attrs = state
  }

  setCurrentPlayer(player) {
    this._currentPlayer = player
    this.attrs.currentPlayer = player.name
  }

  currentPlayer() {
    this._currentPlayer = this._currentPlayer || this.find('players', {name: this.attrs.currentPlayer})
    return this._currentPlayer
  }

  otherPlayer() {
    return _.find(this.attrs.players, (p) => p.name !== this.currentPlayer().name && p.name !== 'None')
  }

  my(collection) {
    return _.filter(this.attrs[collection], {owner: this.currentPlayer().name})
  }

  their(collection) {
    return _.filter(this.attrs[collection], (o) => o.owner !== this.currentPlayer().name)
  }

  his(collection, player) {
    return _.filter(this.attrs[collection], {owner: player.name})
  }

  find(collection, match) {
    return _.find(this.attrs[collection], match)
  }

  isWin(player = this.currentPlayer()) {
    return this.his('airports', player).length === 0
  }

  isLost(player = this.currentPlayer()) {
    return this.my('airports', player).length === 0
  }

  isTerminal() {
    return this.isWin() || this.isLost()
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
