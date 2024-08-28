const pattern = process.argv[3];
const inputLine = require("fs").readFileSync(0, "utf-8").trim();
if (process.argv[2] !== "-E") {
  console.log("Expected first argument to be '-E'");
  process.exit(1);
}
const reg = new RegExp(pattern);
process.exit(!reg.test(inputLine));
