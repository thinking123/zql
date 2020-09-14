function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}
/**
 *  数组是否相同的属性
 * @param {*} arr
 * @param {*} prop
 */
function sameKeys(arr, prop = "key") {
  const keys = arr.reduce((p, c) => {
    const n = c.type === "(" ? c[c.op] : c[prop];
    p[n] = "";
    return p;
  }, {});

  return Object.keys(keys).length < arr.length;
}
export function format(node) {
  const store = {};
  formatAst(store, node);
  return store;
}

/**
 * 优化 ast
 * 1.空的((([])))
 * 2.subquery
 * @param {*} node
 * @param {*} parent
 */
export function refactorStore(node) {
  if (node.type === "query") {
    // 子句
    node.clauses.forEach((f) => f.type === "where" && refactorStore(f));
    return node;
  } else if (node.type === "(") {
    if (!node.op) {
      // 这情况需要优化
      // 1. subquery 情况
      // 2. ((((((((xxx)))))))) 删除() => xxx
      for (let i = 0; i < node.conditions.length; i++) {
        const n = node.conditions[i];
        if (n.subQuery) {
          if (!n.value) {
            n.value = refactorStore(node.conditions[i + 1]);
            node.conditions.splice(i + 1, 1);
          }

          continue;
        }
        node.conditions[i] = refactorStore(n);
      }
      return node.conditions[0];
    } else {
      // node.conditions.forEach((f) => refactorStore(f));

      for (let i = 0; i < node.conditions.length; i++) {
        const n = node.conditions[i];
        if (n.type === "(" && !n.op) {
          node.conditions[i] = refactorStore(n);
          if (!node.conditions[i]) {
            const del = node.conditions.splice(i, 1);
            // console.log(del);
          }
          continue;
        }
        if (n.subQuery) {
          if (!n.value) {
            n.value = refactorStore(node.conditions[i + 1]);
            node.conditions.splice(i + 1, 1);
          }

          continue;
        }
        refactorStore(n);
      }
    }
  } else {
    if (node.conditions) {
      for (let i = 0; i < node.conditions.length; i++) {
        const n = node.conditions[i];
        if (n.type === "(" && !n.op) {
          node.conditions[i] = refactorStore(n);
          if (!node.conditions[i]) {
            node.conditions.splice(i, 1);
          }
          continue;
        }
        if (n.subQuery) {
          if (!n.value) {
            n.value = refactorStore(node.conditions[i + 1]);
            node.conditions.splice(i + 1, 1);
          }

          continue;
        }

        refactorStore(n);
      }
    } else {
      return node;
    }
  }
}
/**
 * 解析ast
 * @param {*} store
 * @param {*} node
 * @param {*} parent
 */
function formatAst(store, node, parent) {
  if (node.type === "(") {
    if (node.op === "and" || node.op === "or") {
      const z = `[ZOp.${node.op}]`;

      //and  , or  : {} , [] : 有相同的key用 []
      // if (!store[z]) store[z] = node.op === "and" ? {} : [];
      const useArray = sameKeys(node.conditions);
      // const p = {
      //   [z]: useArray ? [] : {}
      // }
      // if (store.op) {
      //   if (isArray(store)) {
      //     store.push({
      //       [z]: useArray ? [] : {},
      //     });
      //   } else {
      //     store[z] = useArray ? [] : {};
      //   }
      // } else {
      //   if (!store[z]) store[z] = useArray ? [] : {};
      // }

      if (isArray(store)) {
        store.push({
          [z]: useArray ? [] : {},
        });
      } else {
        store[z] = useArray ? [] : {};
      }
      node.conditions.forEach((n) => formatAst(store[z], n, node));
    } else {
      console.error("error");
    }
  }
  if ((node.value || node.values) && !node.subQuery && !node.isClause) {
    const reg = /\b\s+([^\s])/;
    node.op = node.op.replace(reg, (str, c) => {
      return c.toUpperCase();
    });

    if (isArray(store)) {
      if (node.op === "=") {
        // store[node.key] = node.value || node.values;
        store.push({
          [node.key]: node.value || node.values,
        });
      } else {
        const op = `[ZOp.${node.op}]`;
        store.push({
          [op]: {
            [node.key]: node.value || node.values,
          },
        });
        // const op = `[ZOp.${node.op}]`;
        // store[op] = {
        //   [node.key]: node.value || node.values,
        // };
      }
    } else {
      if (isArray(store)) {
        if (node.op === "=") {
          // store[node.key] = node.value || node.values;

          store.push({
            [node.key]: node.value || node.values,
          });
        } else {
          const op = `[ZOp.${node.op}]`;
          store.push({
            [node.key]: {
              [op]: node.value || node.values,
            },
          });
        }
      } else {
        if (node.op === "=") {
          store[node.key] = node.value || node.values;
        } else {
          const op = `[ZOp.${node.op}]`;
          store[node.key] = {
            [op]: node.value || node.values,
          };
          // store[op] = {
          //   [node.key]: node.value || node.values,
          // };
        }
      }
    }
  }
  if (node.subQuery) {
    const reg = /\b\s+([^\s])/;
    node.op = node.op.replace(reg, (str, c) => {
      return c.toUpperCase();
    });

    const op = `[ZOp.${node.op}]`;

    if (node.value.type === "value") {
      if (isArray(store)) {
        store.push({
          [node.key]: {
            [op]: node.value.value ? node.value.value : node.value.values,
          },
        });
      } else {
        // not subquery is v , xx in (xx,xx)
        store[node.key] = {
          [op]: node.value.value ? node.value.value : node.value.values,
        };
      }
    } else {
      const q = {};
      if (isArray(store)) {
        store.push({
          [node.key]: {
            [op]: q,
          },
        });
      } else {
        store[node.key] = {
          [op]: q,
        };
      }
      formatAst(q, node.value);
    }
  }

  // where xx = xx and (xx in xx) => where xx = xx and xx in xx
  // where xx = xx and (xx in xx and xx = xx ) and (xx in (query xx.xx where xx = xx) )
  if (node.isClause) {
    //not         in => notIn
    const reg = /\b\s+([^\s])/;
    node.type = node.type.replace(reg, (str, c) => {
      return c.toUpperCase();
    });

    switch (node.type) {
      case "where": {
        // if (node.conditions.length === 1 && node.conditions[0].op && !node.op) {
        //   node.op = "and";
        // }

        const useArray = sameKeys(node.conditions);
        const cd = useArray ? [] : {};

        if (!store.condition) {
          // if (node.op) {
          //   store.condition = {
          //     [`ZOp.${node.op}`]: cd,
          //   };
          // } else {
          //   store.condition = cd;
          // }
          store.condition = cd;
        }
        node.conditions.forEach((cond) => formatAst(cd, cond));
        break;
      }
      case "restrictBy": {
        store.restrictBy = {};
        node.conditions.forEach((cond) => {
          store.restrictBy[cond.key] = cond.value;
        });

        break;
      }
      case "returnWith": {
        if (!store.returnWith) store.returnWith = {};
        node.conditions.forEach((c) => {
          if (c === "total") {
            store.returnWith.total = true;
          }
          if (c.type === "(") {
            if (!store.returnWith.zwatch) store.returnWith.zwatch = [];
            c.conditions.forEach((cd) => {
              const zwatch = {};
              store.returnWith.zwatch.push(zwatch);
              cd.conditions.forEach((cds) => {
                if (cds.isFunction) {
                  if (!zwatch.functions) zwatch.functions = [];
                  zwatch.functions.push(`${cds.value}`);
                  // zwatch.functions.push(`${cds.key}${cds.op}${cds.value}`);
                } else if (cds.key.indexOf("labels") > -1) {
                  if (!zwatch.labels) zwatch.labels = [];
                  // zwatch.labels.push(`${cds.key}${cds.op}${cds.value}`);
                  zwatch.labels.push(`${cds.value}`);
                } else {
                  zwatch[cds.key] = cds.value;
                }
              });
            });
          }
        });
        break;
      }
      case "offset":
      case "limit":
      case "namedAs":
      case "orderBy":
      case "groupBy": {
        const n = node.type.replace(/\s+(\w)/, (m, p1) => {
          return p1 && p1.toUpperCase();
        });
        store[n] = node.value ? node.value : node.values;
        if (node.type.indexOf("order by") > -1) {
          store.orderDirection = node.order;
        }
        break;
      }
      default:
        console.error("no type ", node.type);
    }
    // store[node.type] = {
    //   condition: q,
    // };

    // store.push(store);
  }
  if (["query", "count", "sum"].includes(node.type)) {
    // const fields = node.fields.map((f) => f.field);
    const tableName = node.fields[0].field.split(".")[0];
    const fields = node.fields
      .map((f, index) => {
        const l = f.field.indexOf(tableName);
        if (l === 0) {
          return f.field.substring(tableName.length + 1);
        }
        return f.field;
      })
      .filter((f) => f.trim());
    const q = {
      // action: "query",
      tableName,
    };

    if (fields.length > 0) q.fields = fields;
    if (node.parent) {
      store["[ZOp.query]"] = q;
    } else {
      //root
      // q.action = node.type;
      q.action = `ZQLAction.${node.type}`;
      store.querys = [];
      store.querys.push(q);
    }

    if (node.function) {
      q.fnName = node.function;
    }
    node.clauses.forEach((clause) => formatAst(q, clause));
  }
}
