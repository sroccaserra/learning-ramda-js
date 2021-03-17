const {expect} = require('chai');
const R = require('ramda');

describe('map', () => {
  it('applies a function to an array', () => {
    const double = x => x * 2;
    const result = R.map(double, [1, 2, 3]);
    expect(result).to.deep.equal([2, 4, 6]);
  });

  it('applies a function to an object', () => {
    const double = x => x * 2;
    const result = R.map(double, {x: 1, y: 2, z: 3});
    expect(result).to.deep.equal({x: 2, y: 4, z: 6});
  });
});
