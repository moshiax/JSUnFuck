function unfuck(code) {

	if (typeof code !== "string" || !/^[\[\]\(\)!+\s]+$/.test(code)) {
		return "Input isnt valid JSFuck."
	}

	let executed = false
	let result = ""

	const OE = eval
	const OATC = Array.prototype.at.constructor

	function capture(source) {
		executed = true
		result = source
	}

	const HOOKED_ATC = function (src) {
		if (!src) return function () {}

		if (/^\s*return\b/.test(src)) {
			const fn = OATC.call(this, src)
			const value = fn()
			if (typeof value === "string") capture(value)
			return fn
		}

		capture(src)
		return function () {}
	}

	// Eval Source + Run In Parent Scope:
	// JSFuck executes the payload via eval(), so we hook eval
	eval = function (src) {
		if (!src) return
		capture(src + "\n\n")
	}

	// If eval was not used, assume Run In Parent Scope is unchecked.
	// In this case JSFuck executes via native Function resolution:
	// [][at][constructor](payload)()
	HOOKED_ATC.toString = OATC.toString.bind(OATC)
	Array.prototype.at.constructor = HOOKED_ATC
	// Trigger execution of the original JSFuck code
	try {
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
	} finally {
		eval = OE
		Array.prototype.at.constructor = OATC
	}

	return result
}