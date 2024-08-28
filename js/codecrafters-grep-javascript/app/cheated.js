function matchPattern(inputLine, pattern) {
  const reg = new RegExp(pattern);
  return reg.test(inputLine);
}
function main() {
  const pattern = process.argv[3];
  const inputLine = require("fs").readFileSync(0, "utf-8").trim();

  console.log({ pattern, inputLine });

  if (process.argv[2] !== "-E") {
    console.log("Expected first argument to be '-E'");
    process.exit(1);
  }

  // Uncomment this block to pass the first stage
  if (matchPattern(inputLine, pattern)) {
    process.exit(0);
  } else {
    console.log("exitCode: 1");
    process.exit(1);
  }
}

main();
