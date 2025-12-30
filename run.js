function run(code) {
	let executed = false
	let result = ""

	const OE = eval
	const OATC = Array.prototype.at.constructor

	// Eval Source + Run In Parent Scope:
	// JSFuck executes the payload via eval(), so we hook eval
	eval = function (src) {
		executed = true
		result += src + "\n\n"
	}

	// If eval was not used, assume Run In Parent Scope is unchecked.
	// In this case JSFuck executes via native Function resolution:
	// [][at][constructor](payload)()
	Array.prototype.at.constructor = function (src) {
		if (src === "return eval") {
			return OATC.call(this, src)
		}

		executed = true
		result += src + "\n\n"
		return function () {}
	}

	// Trigger execution of the original JSFuck code
	try {
		Function("return " + code)()
	} catch (e) {
		result = String(e)
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