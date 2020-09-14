import { format, refactorStore } from "./formatAst.js";
import { parserQuery, root } from "./parseAst.js";

export let error = [];

if (console && console.error) {
  const org = console.error;
  console.error = (...args) => {
    error.push({
      type: "error",
      msg: args,
    });
    org(...args);
  };
}

// if (console && console.log) {
//   const org = console.log;
//   console.log = (...args) => {
//     error.push({
//       type: "info",
//       msg: args,
//     });
//     org(...args);
//   };
// }

export default function parse(zqlStr) {
  error = [];
  parserQuery(zqlStr);
  refactorStore(root);
  const store = format(root);
  return delStringifyQutos(JSON.stringify(store));
}

function delStringifyQutos(str) {
  const regBracket = /"(\[)|(\])"|"(")|"(')|(')"/gm;
  const _str = str.replace(regBracket, (_s, ...cps) => {
    return cps.slice(0, 5).filter((f) => f)[0];
  });

  // const f = new Function("return " + _str);
  // return f();
  return `${_str}`;
}

export function getErrorMsg() {
  return error.map(({ type, msgs }) => {
    return {
      type,
      msg: typeof msgs === "string" ? msgs.join(" ,\n ") : msgs,
    };
  });
}
