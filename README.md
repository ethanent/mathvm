# mathvm
> Node math processing and execution VM

[GitHub](https://github.com/ethanent/mathvm) | [NPM](https://www.npmjs.com/package/mathvm)

## Install

```
npm i mathvm
```

```js
const mathvm = require('mathvm')
```

## Use

```js
mathvm.exec('1 + 5')
// => 6
```

```js
mathvm.exec('7 + x ^ 2', {
	'vars': {
		'x': 2
	}
})
// => 11
```

```js
mathvm.exec('asin(cos(pi))')
// => -Pi
```

```js
mathvm.exec('5 * add(x, 3)', {
	'functions': {
		'add': (a, b) => a + b
	},
	'vars': {
		'x': 2
	}
})
// => 25
```

## EnvSets

```js
mathvm.exec('sin(pi / 2)')
// => 1

mathvm.exec('sin(pi / 2)', {}, [])
// Errors, function sin does not exist

mathvm.exec('sin(pi / 2)', {}, ['trig'])
// => 1
```
