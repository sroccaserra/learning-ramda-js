const { expect } = require('chai');
const R = require('ramda');
const { Maybe, Either } = require('ramda-fantasy');

// - https://ramdajs.com/docs
// - https://github.com/ramda/ramda-fantasy
// - https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
// - https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch08

// On a besoin du deep pour les equal (les valeurs restent mutables);

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

// const lookup = R.curry((k, obj) => k in obj ? Just(obj[k]) : Nothing());


describe('safeDiv and safeInvert examples', () => {
  // safeDiv :: a -> a -> Maybe a
  const safeDiv = n => d => d === 0 ? Maybe.Nothing() : Maybe.Just(n/d);

  it('returns nothing when dividing by zero', () => {
    const result = safeDiv(4)(0);

    expect(result).to.equal(Maybe.Nothing());
  });

  it('works with R.map', () => {
    const values = [1, 2, 4, 0, 5];
    const safeInvert = x => safeDiv(1)(x);

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
    const deposit = x => x >= 0 ? Either.Right(x) : Either.Left("Error: negative number");
    const invert = x => x != 0 ? Either.Right(1/x) : Either.Left("Error: division by zero");

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
      const invertDeposit = R.composeWith(R.chain, [deposit, invert]);

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
