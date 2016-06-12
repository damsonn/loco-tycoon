import _      from 'lodash'
import should from 'should'
import fs     from 'fs'

import Game   from '../lib/game'

describe('Game', () => {

  let example
  before(() => {
    example = JSON.parse(fs.readFileSync('examples/req.json', 'utf8'))
  })

  describe('#new', () => {
    it('allocate the attributes', () => {
      const game = new Game(example)
      game.attrs.players.length.should.eql(3)
      game.attrs.airports.length.should.eql(5)
    })
  })

  describe('#win', () => {
    it('returns true if I win', () => {
      const game = new Game(_.cloneDeep(example))
      _.find(game.attrs.airports, { key: 'NYC' }).owner = 'None'
      game.win().should.be.true
    })
    it('returns false if I dont win', () => {
      const game = new Game(example)
      game.win().should.be.false
    })
  })

  describe('#next', () => {
    let next
    let game
    before(() => {
      game = new Game(example)
      next = game.next([
        { name: 'Plane1', location:'LHR->DUB' },
        { name: 'Plane2', location:'PEK->MEL' },
        { name: 'Plane3', location:'PEK->MEL' },
        { name: 'Plane-06eee7', location:'MEL->DUB' }
      ])
    })

    it('moves the planes', () => {
      const locations = _(next.attrs.planes).filter({ owner: 'Blue' }).map('location').take(4).value()
      locations.should.eql(['DUB', 'MEL', 'MEL', 'DUB'])
    })

    it('buys plane', () => {
      // should buy 1 plane -> 4 + 1 = 5
      _.filter(next.attrs.planes, { owner: 'Blue' }).length.should.eql(5)
    })

    it('adds money to player', () => {
      // 100 + 150 + 200 + 200 + 50 - 1 plane ( 500 ) = 200
      next.currentPlayer().money.should.eql(200)
    })

    it('calculates loyalties', () => {
      _.find(next.attrs.loyalty, { owner: 'Blue', location: 'DUB' }).amount.should.eql(0)
    })

    it('change airport ownership', () => {
      _.find(next.attrs.airports, { key: 'DUB' }).owner.should.eql('Blue')
    })
  })
})
