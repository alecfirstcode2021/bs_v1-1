const express = require("express")
const SpotifyWebApi = require("spotify-web-api-node")
const cors = require("cors")
const lyricsFinder = require("lyrics-finder")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    console.log("hi")
    const spotifyApi = new SpotifyWebApi({
      redirectUri: 'http://localhost:3000',
      clientId: '4fa3f8755d384650b48a71b1ce8277df',
      clientSecret: 'c92e66282fd24aeb8ddc39f6aa20a9ca',
      refreshToken,
    })

    spotifyApi.refreshAccessToken()
    .then((data)=>{
// console.log(data.body)
res.json({
    accessToken: data.body.access_token,
    expiresIn: data.body.expires_in,
  })
})
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

app.post("/login", (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
      redirectUri: 'http://localhost:3000',
      clientId: '4fa3f8755d384650b48a71b1ce8277df',
      clientSecret: 'c92e66282fd24aeb8ddc39f6aa20a9ca'
    })

    spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })

    })
//Lyrics route
    app.get("/lyrics", async (req, res) => {
        const lyrics =
          (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
        res.json({ lyrics })
      })

    app.listen(3001)