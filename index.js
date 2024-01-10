const http = require("https");
const crypto = require("crypto");

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const hash = "0000000000000bae09a7a393a8acded75aa67e46cb81f7acaa5ad94f9eacd103";
//const difficulty = 7;
const iterates = 2000;

function rev(str) {
  const splt = str.split(/(..)/g).filter((s) => s);
  const res = [];
  for (i = splt.length - 1; i >= 0; i--) {
    res.push(splt[i]);
  }
  return res.join("");
}

//async function mine() {

http.get(`https://blockchain.info/rawblock/${hash}`, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    data = JSON.parse(data);
    let it = 0;
    let curr_clc_hash = "";

    async function mine() {
    while (curr_clc_hash != hash) {

//    async function mine() {

      const date = data.time.toString(16);
      const nonce = data.nonce.toString(16);
      const version = Buffer.alloc(4).writeInt32LE(data.ver, 0).toString(16);
      const dct = it.toString(16);
      const merkel = data.mrkl_root;
      const prev_hash = data.prev_block;
      const hsh = Buffer.from(
        rev(nonce + dct + date + merkel + prev_hash + version),
        "hex"
      );
      const first_hash = Buffer.from(
        crypto.createHash("sha256").update(hsh).digest("hex"),
        "hex"
      );
      curr_clc_hash = rev(
        crypto.createHash("sha256").update(first_hash).digest("hex")
      );
      console.log(curr_clc_hash);
      it++;
      await new Promise(resolve => setTimeout(resolve, 100));

     }

    }
mine();
  });
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
