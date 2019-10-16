module.exports = {
	'trig': {
		'functions': {
			'sin': (a) => Math.sin(a),
			'cos': (a) => Math.cos(a),
			'tan': (a) => Math.tan(a),
			'sec': (a) => 1 / Math.cos(a),
			'csc': (a) => 1 / Math.sin(a),
			'cot': (a) => 1 / Math.tan(a),
			'asin': (a) => Math.asin(a),
			'acos': (a) => Math.acos(a),
			'atan': (a) => Math.atan(a),
			'asec': (a) => Math.acos(1 / a),
			'acsc': (a) => Math.asin(1 / a),
			'asec': (a) => Math.acos(1 / a)
		},
		'vars': {
			'pi': Math.PI
		}
	}
}
