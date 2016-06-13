import _      from 'lodash'
import should from 'should'
import fs     from 'fs'

import minimax, { cartesianProduct, uniqueKey } from '../lib/minimax'

describe('minimax', () => {

  let example
  before(() => {
    example = JSON.parse(fs.readFileSync('examples/req.json', 'utf8'))
  })

  describe('#cartesianProduct', () => {
    it('return the an array of the right shape', () => {
      const a = [ [1, 2], [3, 4] ]
      const prod = cartesianProduct(a)
      prod.length.should.eql(4)
      prod[0].length.should.eql(2)
    })
  })

  // describe('#uniqueKey', () => {
  //   it('returns the same key when two diff planes are on the same location', () => {
  //     const similar = _.cloneDeep(example)
  //     // switch locations
  //     similar.planes[0].location = 'PEK'
  //     similar.planes[1].location = 'LHR'
  //
  //     uniqueKey(example).should.eql(uniqueKey(similar))
  //   })
  //   it('returns diff when planes are moved', () => {
  //     const diff = _.cloneDeep(example)
  //     // move locations
  //     diff.planes[0].location = 'DUB'
  //
  //     uniqueKey(example).should.not.eql(uniqueKey(diff))
  //   })
  // })

  describe('#minimax', () => {
    it('works with the example', () => {
      minimax(example)
    })
  })
})
