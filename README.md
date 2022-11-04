## Apprentissages

- On peut faire des Either et des Maybe avec ramda-fantasy
- Ramda suit la spec Fantasy Land
- On peut composer des fonctions qui prennent une valeur en entrée et qui
  renvoient des Either avec `R.composeWith(R.chain)` (railway programming,
  c'est l'opérateur composition de fonctions `>=>` de Haskell)
- Le chain des Either se fait sur les Either.Right (même convention que
  Haskell)
- On a besoin du deep pour les equal (probablement car les valeurs restent
  mutables)

- Signature de `>=>` en Haskell :

```
(>=>) :: Monad m => (a -> m b) -> (b -> m c) -> a -> m c

Left-to-right composition of Kleisli arrows.

'(bs >=> cs) a' can be understood as the do expression

do b <- bs a
   cs b
```

- Voir aussi `>>=` :

```
(>>=) :: forall a b. m a -> (a -> m b) -> m b infixl 1

Sequentially compose two actions, passing any value produced by the first as an argument to the second.

'as >>= bs' can be understood as the do expression

do a <- as
   bs a
```

- Dans l'exemple vu ici en JS, on a `deposit 1 >>= invert` qui est équivalent à
  `(deposit >=> invert) 1`. Si on ajoute artificiellement un niveau pas
  nécessaire pour voir à quoi ça ressemble avec trois appels, on a `Just 1 >>=
  deposit >>= invert` qui est équivalent à `(Just >=> deposit >=> invert) 1`.
  Pour généraliser, dans le paradigme Applicative, on peut utiliser `pure` au
  lieu de `Just`, et dans le contexte Monade on peut utiliser `return` au lieu
  de `Just`.

## Références

- https://ramdajs.com/docs
- https://github.com/ramda/ramda-fantasy
- https://github.com/fantasyland/fantasy-land
- https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
- https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch08
