const inspect = (a) => require('util').inspect(a, {'depth': 10})

const getIndexes = (arr, val) => arr.map((v, i) => [v, i]).filter((e) => e[0] === val).map((e) => e[1])

const digit = /[0-9]|\./
const symbol = /\+|\-|\/|\*|\^/
const variable = /[a-zA-Z]/

const actionOrder = [
	['^'],
	['*', '/'],
	['+', '-']
]

const tokenize = (txt) => {
	const segs = txt.split('').filter((e) => !(/\s/.test(e)))

	const nextSegs = []

	for (let i = 0; i < segs.length; i++) {
		if (digit.test(segs[i])) {
			// Is number

			let testI = i + 1

			while (testI < segs.length && digit.test(segs[testI])) {
				testI++
			}

			const lastDigitI = testI

			nextSegs.push(Number(segs.slice(i, lastDigitI).join('')))

			i = lastDigitI - 1
		}
		else {
			nextSegs.push(segs[i])
		}
	}

	return nextSegs
}

const processTokens = (toks) => {
	const build = []

	let mode = 0
	let building = null

	for (let i = 0; i < toks.length; i++) {
		const insert = (val) => {
			if (building !== null) {
				val.parent = building

				if (building.type === 'parenObject') {
					building.contents.push(val)
				}
				else throw new Error('Unexpected type for building \'' + building.type + '\'.')

				if (val.type === 'parenObject') {
					building = val
				}
			}
			else {
				build.push(val)
				val.parent = null

				if (val.insertable === true) {
					building = val
				}
			}
		}

		if (toks[i] === '(') {
			insert({
				'type': 'parenObject',
				'contents': [],
				'insertable': true
			})
		}
		else if (toks[i] === ')') {
			building = building.parent
		}
		else if (typeof toks[i] === 'number') {
			insert({
				'type': 'number',
				'value': toks[i],
				'insertable': false
			})
		}
		else if (symbol.test(toks[i])) {
			insert({
				'type': 'rawSymbol',
				'value': toks[i],
				'insertable': false
			})
		}
		else if (variable.test(toks[i])) {
			insert({
				'type': 'variable',
				'name': toks[i],
				'insertable': false
			})
		}
		else {
			console.log('Unprocessed token \'' + toks[i] + '\' while processing')
		}
	}

	return build
}

const groupOperations = (parsed) => {
	let build = null

	if (parsed.length === 1) {
		const item = parsed[0]

		if (item.type === 'number' || item.type === 'variable') {
			return item
		}
		else if (item.type === 'parenObject') {
			return groupOperations(item.contents)
		}
		else {
			throw new Error('Unexpected type while grouping \'' + item.type + '\'')
		}
	}

	for (let b = 0; b < actionOrder.length; b++) {
		const actions = actionOrder[b]

		for (let i = 0; i < parsed.length; i++) {
			if (parsed[i].type === 'rawSymbol') {
				if (actions.includes(parsed[i].value)) {
					// Relevant action

					build = {
						'type': 'operation',
						'action': parsed[i].value,
						'between': [
							groupOperations(parsed.slice(0, i)),
							groupOperations(parsed.slice(i + 1))
						]
					}
				}
				
				// Otherwise not correct action for this round
			}
		}
	}

	return build
}

const execGrouped = (item, varspace = {}, functionSpace = {}) => {
	if (item.type === 'number') {
		return item.value
	}
	else if (item.type === 'variable') {
		if (typeof varspace[item.name] === 'number') {
			return varspace[item.name]
		}
		else throw new Error('Undefined variable \'' + item.name + '\' while executing.')
	}
	else if (item.type === 'operation') {
		const valueA = execGrouped(item.between[0], varspace)
		const valueB = execGrouped(item.between[1], varspace)

		if (item.action === '^') {
			return Math.pow(valueA, valueB)
		}
		else if (item.action === '*') {
			return valueA * valueB
		}
		else if (item.action === '/') {
			return valueA / valueB
		}
		else if (item.action === '+') {
			return valueA + valueB
		}
		else if (item.action === '-') {
			return valueA - valueB
		}
		else throw new Error('Unexpected action \'' + item.action + '\' while executing.')
	}
	else throw new Error('Unexpected type while executing \'' + item.type + '\'')
}

const exec = (math, context = {
	'vars': {},
	'functions': {}
}) => execGrouped(groupOperations(processTokens(tokenize(math))), context.vars, context.functions)

module.exports = { exec }

