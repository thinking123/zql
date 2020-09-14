// import { zql, zql1, zql2, zql3, zqll2, zql6 } from "./zqlConstant.js";
// import { p1, refactorStore } from "./c.js";
// const fs = require("fs");

const qname = "(query|count|sum)";
const queryStart = new RegExp(`^\\s*${qname}`);
const queryBracketStart = /^\s*(\()/;
const queryAndOr = /^\s*(and|or)/;
const queryBracketEnd = /^\s*(\))/;
const queryFunction = /^\s*(distinct)/;
const queryFields = /^\s*([^\s,()]+)\s*(?:,)?/;
const queryFields1 = /^\s*([^\s()]+)\s*(?:,)/;
const queryFields2 = /^\s*([^\s()]+)\s*(?=[)])/;
const queryConds = /^\s*(where|restrict\s+by|return\s+with|group\s+by|order\s+by|limit|offset|filter\s+by|named\s+as)/;

// 匹配 'xxx' = 'xxx' | xxx = 'xxx' | "xxx" = xxx
const queryCondsOp1 = /^\s*([^\s()]+)\s*(=|>|<|!=)\s*([^\s(),]+)(?:\s*,?)/;
const queryCondsOpnoStart = /\s*([^\s!<>=()]+)(?:\s*(=|>|<|!=)\s*(?:("[^"]*")|('[^']*')|([^\s"'=,()]+)))(?:\s*,?)/;
const queryCondsOpnoStartZwatch = /^\s*([^\s!<>=]+)(?:\s*(=|>|<|!=)\s*(?:([^,]*)+))(?:\s*,?)/;
const queryCondsOp2 = /^\s*([^\s()]+)\s+(?:(not\s+has)|((?<!not\s+)has)|(not\s+in)|(like)|((?<!not\s+)in))\s+([^\s()]*)/;
const queryCondsOp3 = /^\s*([^\s()]+)\s+(?:(not\s+has)|((?<!not\s+)has)|(not\s+in)|(like)|((?<!not\s+)in))\s+([^\s()]*)(?=(?:\s*\())/;
const querySub = /^(\s*\()*\s*query/;
const queryZwatch = /^\s*(zwatch)\s*{([^{}]*)}(?:\s*,?)/;
export let root;
let c = 0;

export function parserQuery(zql) {
  // error = [];
  const stack = [];
  root = null;
  let index = 0;
  //只有query 和 (  才会改current
  let current;
  zql = zql.trim();

  function getParent(p) {
    // return current;
    while (p && p.parent && p.type == "(") {
      p = p.parent;
    }

    return p;
  }
  while (zql && zql.length) {
    if (c > 99) break;

    let q = zql.match(queryBracketStart);

    if (q) {
      let cond = {
        type: "(",
        parent: current,
        conditions: [],
        match: q[0],
      };

      push(cond);
      current = cond;
      stack.push(cond);
      advance(q[0].length, false);
      continue;
    }
    q = zql.match(queryBracketEnd);
    if (q) {
      let pos = stack.length - 1;
      current = stack[pos].parent;
      stack.length = pos;
      advance(q[0].length, false);
      continue;
    }

    q = zql.match(queryZwatch);
    if (q) {
      const cond = {
        type: q[1],
        conditions: [],
        isZwatch: true,
        match: q[0],
      };
      const l = q[0].length;
      let match = q[2];

      const fs = match.split(",").map((f) => {
        const p = f.match(queryCondsOpnoStartZwatch);

        const d = {
          key: p[1],
          op: p[2],
          value: p[3],
        };

        if (p[1].indexOf("functions") > -1) {
          d.isFunction = true;
        }

        return d;
      });

      cond.conditions = fs;

      if (!current.conditions) current.conditions = [];
      current.conditions.push(cond);
      advance(l, false);

      continue;
    }

    //(where|restrict by|return with|group by|order by|limit|offset|filter by|named as)
    q = zql.match(queryConds);
    if (q) {
      const clause = {
        type: q[1],
        conditions: [],
        isClause: true,
        op: undefined,
        match: q[0],
        // parent: current,
      };
      advance(q[0].length);

      parseClause(clause);
      // current is query
      const pCurrent = getParent(current);
      pCurrent.clauses.push(clause);

      continue;
    }

    // xx = 'xx'
    q = zql.match(queryCondsOp1);
    if (q) {
      let value = q[3];
      let cond = {
        key: q[1],
        op: q[2],
        value,
        match: q[0],
      };

      if (value.indexOf(",") > -1) {
        cond.values = value.split(",");
      }

      push(cond);
      advance(q[0].length);
      continue;
    }

    // xx in (xx,xx)
    // xx in (((xx,xx)))
    q = zql.match(queryFields1) || zql.match(queryFields2);
    if (q) {
      const values = [];
      let match = "";
      while ((q = zql.match(queryFields1) || zql.match(queryFields2))) {
        values.push(q[1]);
        match += q[0];
        advance(q[0].length);
        continue;
      }

      const cond = {
        values,
        type: "value",
        match,
      };

      push(cond);
      continue;
    }

    // xx  in subquery
    //xx in (xx,xx)
    // subquery -> cluase | condition
    q = zql.match(queryCondsOp3);
    if (q) {
      const cond = {
        key: q[1],
        op: q.slice(2, 7).reduce((p, c) => p || c),
        value: undefined,
        parent: current,
        subQuery: true,
        match: q[0],
      };

      push(cond);
      advance(q[0].length);
      continue;
    }

    // xx not in [xx,xx] and not subquery
    q = zql.match(queryCondsOp2);
    if (q) {
      let value = q[7];
      if (!value.match(querySub)) {
        let cond = {
          key: q[1],
          op: q.slice(2, 7).reduce((p, c) => p || c),
          value,
          match: q[0],
        };
        if (value.indexOf(",") > -1) {
          cond.values = value.split(",");
        }

        push(cond);
        advance(q[0].length);
        continue;
      }
    }
    // and/or
    q = zql.match(queryAndOr);
    if (q) {
      if (current.type === "query") {
        const clause = current.clauses[current.clauses.length - 1];
        clause.op = q[1];
      } else {
        if (current.op && current.op != q[1]) {
          console.error(`op : ${current.op} != ${q[1]}`);
        }
        current.op = q[1];
        current.match = q[0];
      }

      advance(q[0].length);
      continue;
    }

    // distinct(xx,xx)
    q = zql.match(queryFunction);
    if (q) {
      current.function = q[1];
      current.match = q[0];
      advance(q[0].length);

      const fieldsReg = /^\s*\(([^()]*)\)/;
      q = zql.match(fieldsReg);
      if (q[1]) {
        const fields = q[1].split(",").map((f) => ({
          field: f,
        }));
        current.fields = fields;
        advance(q[0].length);
      } else {
        console.error("distinct must have fields");
        return;
      }
      continue;
    }
    // query xxx.xxx
    q = zql.match(queryStart);
    if (q) {
      const c = {
        type: q[1],
        fields: [],
        clauses: [],
        parent: current,
        match: q[0],
      };

      push(c);
      current = c;
      advance(q[0].length);
      if (!root) root = current;
      let cond = undefined;
      let field;
      while (
        !(cond = zql.match(queryConds)) &&
        (field = zql.match(queryFields)) &&
        zql.length
      ) {
        if (field[0].indexOf("distinct") > -1) break;
        current.fields.push({
          field: field[1],
        });
        advance(field[0].length);
      }

      continue;
    }

    console.error("no match");
    break;
  }

  function push(cond) {
    if (!current) return;
    if (current.type === "query") {
      const clause = current.clauses[current.clauses.length - 1];
      clause.conditions.push(cond);
    } else {
      current.conditions = current.conditions || [];
      current.conditions.push(cond);
    }
  }
  function advance(n, show = true) {
    index += n;

    const dstr = zql.substring(0, n);
    // const reg = /\s*(\(|\)\s*)/;
    if ((dstr.indexOf("(") > -1 || dstr.indexOf(")") > -1) && show) {
      console.error("no regex match", dstr);
    }
    show && console.log(dstr.trim());

    zql = zql.substring(n);
    // c++;

    // console.log(`zql : ${index}`, zql.substring(0, 20));
  }
  // console.log(`zql : ${index}`, stack);

  function parseClause(clause) {
    let q;
    switch (clause.type) {
      case "where":
        return;
      case "return with": {
        const reg = /^\s*\(([^(){}]*)\)/;
        q = zql.match(reg);
        if (q) {
          const l = q[0].length;
          const values = q[1].split(",");
          clause.conditions = values;
          advance(l, false);
        } else {
          console.error(`[${clause.type} : ] must have number params`);
        }
        return;
      }
      case "restrict by": {
        const reg = /^\s*\(([^()]*)\)/;
        q = zql.match(reg);
        if (q) {
          let _q = q[1];
          const l = q[0].length;
          const _reg = new RegExp(queryCondsOpnoStart.source, "g");
          while ((q = _reg.exec(_q)) !== null) {
            let value = q[3] || q[4] || q[5];
            let cond = {
              key: q[1],
              op: q[2],
              value,
            };
            clause.conditions.push(cond);
          }
          advance(l, false);
        } else {
          console.error(`[${clause.type} : ] must have number params`);
        }
        return;
      }

      case "offset":
      case "limit": {
        const reg = /\s*(\d+)/;
        q = zql.match(reg);
        if (q) {
          const l = q[0].length;

          clause.value = q[1];
          advance(l, false);
        } else {
          console.error(`[${clause.type} : ] must have number params`);
        }
        return;
      }

      case "group by":
      case "named as": {
        const reg = /^\s*(?:(?:(\w+)|\(([^()]+)\)))/;
        q = zql.match(reg);
        if (q) {
          const l = q[0].length;
          const v = q[1] || q[2];
          const arr = v.split(",").length > 1;
          arr ? (clause.values = v.split(",")) : (clause.value = v);
          advance(l, false);
        } else {
          console.error(`[${clause.type} : ] must have number params`);
        }
        return;
      }

      case "order by": {
        const reg = /^\s*(?:(?:(\w+)|\(([^()]+)\)))\s*(asc|desc)/;
        q = zql.match(reg);
        if (q) {
          const l = q[0].length;

          const v = q[1] || q[2];
          const arr = v.split(",").length > 1;
          arr ? (clause.values = v.split(",")) : (clause.value = v);
          clause.order = q[3];
          advance(l, false);
        } else {
          console.error(`[${clause.type} : ] must have number params`);
        }
        return;
      }
      default: {
        console.error("no match in clauses", clause.type);
      }
    }
  }
}
