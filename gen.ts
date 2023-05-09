import { writeFileSync } from "fs"

{
  function* gen() {
    for (let x = 0; x < (2 ** 16); x++)
      yield `${x}: ${x + 1}`
  }

  const script = `export type Increment<X extends number> = {
    [index: number]: number;
    ${[...gen()].join(`\n`)}
  }[X]`

  writeFileSync("./src/mods/numbers/increment.ts", script)
}

{
  function* gen() {
    for (let x = 1; x < (2 ** 16); x++)
      yield `${x}: ${x - 1}`
  }

  const script = `export type Decrement<X extends number> = {
    [index: number]: number;
    0: never;
    ${[...gen()].join(`\n`)}
  }[X]`

  writeFileSync("./src/mods/numbers/decrement.ts", script)
}

{
  function* gen() {
    for (let x = 0; x < 10; x++)
      yield `| ${x}`
  }

  const script = `export type Digit =
    ${[...gen()].join(`\n`)}`

  writeFileSync("./src/mods/numbers/digit.ts", script)
}

{
  function* gen() {
    for (let x = 10; x < (2 ** 16); x++)
      yield `${x}: ${x - 9}`
  }

  const script = `export type Decrement10<X extends number> = {
    [index: number]: number;
    ${[...gen()].join(`\n`)}
  }[X]`

  writeFileSync("./src/mods/numbers/decrement10.ts", script)
}

{
  function* gen() {
    for (let x = 0; x < (2 ** 16); x++)
      yield `${x}: ${x + 9}`
  }

  const script = `export type Increment10<X extends number> = {
    [index: number]: number;
    ${[...gen()].join(`\n`)}
  }[X]`

  writeFileSync("./src/mods/numbers/increment10.ts", script)
}

{
  function* gen() {
    for (let x = 0; x < 100; x++)
      yield `${x}: 0`
    for (let x = 100; x < (2 ** 16); x++)
      yield `${x}: ${x - 99}`
  }

  const script = `export type Decrement100<X extends number> = {
    [index: number]: number;
    ${[...gen()].join(`\n`)}
  }[X]`

  writeFileSync("./src/mods/numbers/decrement100.ts", script)
}

{
  function* gen() {
    for (let x = 0; x < (2 ** 16); x++)
      yield `${x}: ${x + 99}`
  }

  const script = `export type Increment100<X extends number> = {
    [index: number]: number;
    ${[...gen()].join(`\n`)}
  }[X]`

  writeFileSync("./src/mods/numbers/increment100.ts", script)
}
