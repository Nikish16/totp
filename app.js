const Express = require("express");
const BodyParser = require("body-parser");
const Speakeasy = require("speakeasy");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

// app.post("/totp-secret", (request, response, next) => {  });
// app.post("/totp-generate", (request, response, next) => { });
// app.post("/totp-validate", (request, response, next) => { });

app.post("/totp-secret", (request, response, next) => {
    var secret = Speakeasy.generateSecret({ length: 20 });
    response.send({ "secret": secret.base32 });
});
//generate TOTP tokens
app.post("/totp-generate", (request, response, next) => {
    response.send({
        "token": Speakeasy.totp({
            secret: request.body.secret,
            encoding: "base32"
        }),
        "remaining": (30 - Math.floor((new Date()).getTime() / 1000.0 % 30))
    });
});

//validation function
app.post("/totp-validate", (request, response, next) => {
    response.send({
        "valid": Speakeasy.totp.verify({
            secret: request.body.secret,
            encoding: "base32",
            token: request.body.token,
            window: 0
        })
    });
});

app.listen(3000, () => {
    console.log("Listening at :3000...");
});