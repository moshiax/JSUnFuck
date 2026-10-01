# JSUnFuck

JSFuck decoder that extracts JavaScript source by evaluating JSFuck and
intercepting some of its execution paths.

---

## How it works

JSFuck executes the generated payload using one of two mechanisms:

1. **`eval`**
   - Used when **Eval Source** and **Run In Parent Scope** are enabled
   - Payload is executed via `eval(code)`

2. **`Array.prototype.at.constructor`**
   - Used when **Run In Parent Scope** is unchecked
   - Resolved indirectly via:
     ```js
     [][ "at" ][ "constructor" ](payload)()
     ```
   - This bypasses simple hooks on `eval` and global `Function`

JSUnFuck intercepts both execution paths:

- `eval` is temporarily replaced to capture the code passed to it
- `Array.prototype.at.constructor` is temporarily replaced to intercept
  indirect function constructor calls

Instead of executing the payload, the tool extracts the generated JavaScript
source and prints it to the output.

If no execution path is triggered, the input is treated as a **pure JSFuck
expression** and evaluated as a value.

 Just show me the code
→ **[unfuck.js](unfuck.js)**
---

## Security

> **JSUnFuck is not a sandbox
> It can execute arbitrary JavaScript in page or process that calls `unfuck()`.

While decoder evals JSFuck expression and hooks its paths 
(`eval` and `Array.prototype.at.constructor`), JavaScript has other constructors, 
eg `[]["filter"]["constructor"]`, which can bypass `at` hook. 
Fallback used for pure expressions can also evaluate an input more than once.
Check  **[poc.js](poc.js)** for more