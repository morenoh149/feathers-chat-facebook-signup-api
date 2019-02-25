# feathers-chat-facebook-signup-api

Clone from https://github.com/feathersjs/feathers-chat

## What does this do?

The changes in this repo add actions 3-6 in the diagram.
![](https://i.stack.imgur.com/HIybu.png)

## Add Signup via facebook for mobile apps

Assuming you begin from where the feather's chat tutorial finishes and you'd
like to add user registration via Facebook

* `npm install @feathersjs/authentication-oauth2 passport-facebook-token --save`
* edit `src/authentication.js` to configure the authentication to use the Facebook passport strategy. See [diff](https://github.com/morenoh149/feathers-chat-facebook-signup-api/commit/0286c89c7b24094ee3874bc340d6254ecfb95a28#diff-71d8cab214a29266b775cb63c40244d7R4).
* add your Facebook app credentials and permissions you want to `config/default.json`. See [diff](https://github.com/morenoh149/feathers-chat-facebook-signup-api/commit/0286c89c7b24094ee3874bc340d6254ecfb95a28#diff-71d8cab214a29266b775cb63c40244d7R13).
* edit the gravatar hook to read the email from the facebook profile. See [diff](https://github.com/morenoh149/feathers-chat-facebook-signup-api/commit/0286c89c7b24094ee3874bc340d6254ecfb95a28#diff-71d8cab214a29266b775cb63c40244d7R15).
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

## I get a facebook-tokenId error?

This means your api is strictly enforcing the fields (this example project uses NEDB which unlike objection.js does not care if an entity's field is missing).

Add `facebook-token` and `facebook-tokenId` as a field on your User model.
```es
class users extends Model {
  static get tableName() {
    return "users";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["phoneNumber"],
                               
      properties: {
        email: { type: ["string", "null"] },
        "facebook-token": { type: "text" },
        "facebook-tokenId": { type: "text" },
...
      }
    };
  }
}
```
Also create a knex database migration if you are using knex.
