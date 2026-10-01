globalThis.unfuckpwn = {
	encode(source) {
		const encode = value => JSFuck.encode(value, false, false)
		const payload = `[][( ${encode("filter")} )][( ${encode("constructor")} )](( ${encode(source)} ))()`
		return payload.replaceAll(" ", "")
	}
}

const payload = unfuckpwn.encode("console.log(1)")

unfuck(payload)
