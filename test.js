const { expect } = require('chai');
const R = require('ramda');
const { Maybe, Either } = require('ramda-fantasy');

describe('R.map', () => {
  // double :: Number -> Number
  const double = x => x * 2;

  it('applies a function to an array', () => {
    const result = R.map(double, [1, 2, 3]);

    expect(result).to.deep.equal([2, 4, 6]);
  });

  it('applies a function to an object', () => {
    const result = R.map(double, {x: 1, y: 2, z: 3});

    expect(result).to.deep.equal({x: 2, y: 4, z: 6});
  });
});

describe('safeDiv and safeInvert examples', () => {
  // safeDiv :: Number -> Number -> Maybe Number
  const safeDiv = n => d => (d === 0)
    ? Maybe.Nothing()
    : Maybe.Just(n/d);

  // safeInvert :: Number -> Maybe Number
  const safeInvert = x => safeDiv(1)(x);

  it('returns nothing when dividing by zero', () => {
    const result = safeDiv(4)(0);

    expect(result).to.equal(Maybe.Nothing());
  });

  it('works with R.map', () => {
    const values = [1, 2, 4, 0, 5];

    const result = R.map(safeInvert, values);

    expect(result).to.deep.equal([
      Maybe.Just(1),
      Maybe.Just(0.5),
      Maybe.Just(0.25),
      Maybe.Nothing(),
      Maybe.Just(0.2),
    ]);
  });

  describe('Compose functions that return either value or error', () => {
    // deposit :: Number -> Either String Number
    const deposit = x => (x < 0)
      ? Either.Left("Error: negative number")
      : Either.Right(x);

    // invert :: Number -> Either String Number
    const invert = x => (x == 0)
      ? Either.Left("Error: division by zero")
      : Either.Right(1/x);

    // invertDeposit :: Number -> Either String Number
    const invertDeposit = R.composeWith(R.chain, [deposit, invert]);


    describe('deposit', () => {
      it('returns a value for positive numbers', () => {
        const result = deposit(5);

        expect(result).to.deep.equal(Either.Right(5));
      });

      it('returns an error message for negative numbers', () => {
        const result = deposit(-5);

        expect(result).to.deep.equal(Either.Left("Error: negative number"));
      });
    });

    describe('invert', () => {
      it('returns a value for non zero numbers', () => {
        const result = invert(5);

        expect(result).to.deep.equal(Either.Right(0.2));
      });

      it('returns an error message for divisions by zero', () => {
        const result = invert(0);

        expect(result).to.deep.equal(Either.Left("Error: division by zero"));
      });
    });

    describe('compose a deposit with an inversion', () => {
      it('returns a value for strictly positive numbers', () => {
        const result = invertDeposit(5);

        expect(result).to.deep.equal(Either.Right(0.2))
      });

      it('returns a left for zero numbers', () => {
        const result = invertDeposit(0);

        expect(result).to.deep.equal(Either.Left("Error: division by zero"))
      });

      it('returns a left for negatve numbers', () => {
        const result = invertDeposit(-5);

        expect(result).to.deep.equal(Either.Left("Error: negative number"))
      });
    });
  });
});
