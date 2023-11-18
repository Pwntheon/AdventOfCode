import { isDeepStrictEqual } from "util";
import kleur from "kleur";
import { curry } from "@arrows/composition";

let index = 0;

const test = curry((result, expected, label = "") => {
  const passed = isDeepStrictEqual(result, expected)
  if(label.length) label = ` (${label})`;
  if (passed) {
    console.log(kleur.green(`Test #${index}${label}: passed`))
  } else {
    console.log(kleur.gray("-----------------------------------------"))
    console.log(kleur.red(`Test #${index}${label}: failed`))
    console.log(kleur.gray("\nResult:"))
    console.dir(result, { colors: true, depth: 0 })
    console.log(kleur.gray("\nExpected:"))
    console.dir(expected, { colors: true, depth: 0 })
    console.log(kleur.gray("-----------------------------------------"))
  }

  index++
})

export {
  test
};