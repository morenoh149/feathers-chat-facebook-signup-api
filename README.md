# feathers-chat-facebook-signup-api

Clone from https://github.com/feathersjs/feathers-chat

## What does this do?

The changes in this repo add actions 3-6 in the diagram.
![](https://i.stack.imgur.com/HIybu.png)

## Add Signup via facebook for mobile apps

Assuming you begin from where the feather's chat tutorial finishes and you'd
like to add user registration via Facebook

* `npm install @feathersjs/authentication-oauth2 passport-facebook-token --save`
* edit `src/authentication.js` to configure the authentication to use the Facebook passport strategy. See [diff](https://github.com/morenoh149/feathers-chat-facebook-signup-api/commit/902cdcd6684f06cf3dbfcb6e54ac3366982e97ba#diff-7d8c4022a164764afd1cb4a678159566R4).
* add your Facebook app credentials and permissions you want to `config/default.json`. See [diff](https://github.com/morenoh149/feathers-chat-facebook-signup-api/commit/902cdcd6684f06cf3dbfcb6e54ac3366982e97ba#diff-1e9c3d615e9ebaaaa3669b4c2fd87d00R13).
* edit the gravatar hook to read the email from the facebook profile. See [diff]().
* run the api `npm start`
* generate a Facebook short lived access_token via your phone app or the [Graph API Explorer](https://developers.facebook.com/tools/explorer). Make sure you request access to the user's email.
* generate a user
```sh
curl localhost:3030/authentication -X POST -H "Authorization: Bearer <access token>"
```
the api will respond with a jwt.
* verify the user is signed up, use the jwt the api generated to authorize
```
curl localhost:3030/users -H "Authorization: Bearer <jwt>" | jq
```
Note, I piped the api response into [jq](https://stedolan.github.io/jq/) which makes it easier to read.
