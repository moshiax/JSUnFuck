function unfuck(code) {
	let executed = false
	let result = ""

	const OE = eval
	const OATC = Array.prototype.at.constructor

	// Eval Source + Run In Parent Scope:
	// JSFuck executes the payload via eval(), so we hook eval
	eval = function (src) {
		if (!src) return
		executed = true
		result += src + "\n\n"
	}

	// If eval was not used, assume Run In Parent Scope is unchecked.
	// In this case JSFuck executes via native Function resolution:
	// [][at][constructor](payload)()
	Array.prototype.at.constructor = function (src) {
		if (!src) return function () {}

		if (["return eval", "return/false/", "return escape", "return Date"].includes(src)) {
			return OATC.call(this, src)
		}

		const hasEscapes = /\\[0-7]{2,3}/.test(src)

		if (hasEscapes) {
			try {
				const decoded = Function(src)()
				if (decoded) result += decoded.toString()
			} catch (e) {}
		} else {
			result += src
		}

		executed = true
		return function () {}
	}

	// Trigger execution of the original JSFuck code
	try {
		Function("return " + code)()
	} catch (e) {
		result = String(e)
		throw e
	}

	// If no execution path was triggered, this is a pure expression.
	// Evaluate it normally and return the resulting value.
	if (!executed && !result) {
		try {
			result = String(Function("return " + code)())
		} catch (e) {
			result = String(e)
		}
	}

	// Restore original environment
	eval = OE
	Array.prototype.at.constructor = OATC

	return result
}