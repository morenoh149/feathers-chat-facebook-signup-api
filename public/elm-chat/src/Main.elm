module Main (..) where

import Html exposing (Html)
import Effects exposing (Effects, none)
import StartApp exposing (start, App)
import View exposing (view)
import Models exposing (..)
import Task exposing (Task)


app : App Model
app =
  start
    { init = init
    , view = view
    , update = update
    , inputs =
        [ Signal.map (NewMessage) messagesIn
        , Signal.map (NewUser) usersPort
        ]
    }


main : Signal Html
main =
  app.html


port tasks : Signal (Task Effects.Never ())
port tasks =
  app.tasks


port usersPort : Signal User
port messagesIn : Signal Message
port messagesOut : Signal String
port messagesOut =
  messagesOutMailbox.signal


messagesOutMailbox : Signal.Mailbox String
messagesOutMailbox =
  Signal.mailbox ""


port logoutPort : Signal ()
port logoutPort =
  logoutPortMailbox.signal


logoutPortMailbox : Signal.Mailbox ()
logoutPortMailbox =
  Signal.mailbox ()


init : ( Model, Effects Action )
init =
  let
    model =
      { textbox = ""
      , messages = []
      , users = []
      }
  in
    ( model, none )


newList : List Message -> Message -> List Message
newList list message =
  List.append list [ message ]
    |> List.sortBy .createdAt


update : Action -> Model -> ( Model, Effects Action )
update action model =
  case action of
    NoOp ->
      ( model, none )

    NewMessage message ->
      ( { model | messages = newList model.messages message }, none )

    NewUser user ->
      ( { model | users = List.append model.users [ user ] }, none )

    Typing value ->
      ( { model | textbox = value }, none )

    SendMessage ->
      let
        fx =
          Signal.send messagesOutMailbox.address model.textbox
            |> Task.map (always NoOp)
            |> Effects.task
      in
        ( { model | textbox = "" }, fx )

    Logout ->
      let
        fx =
          Signal.send logoutPortMailbox.address ()
            |> Task.map (always NoOp)
            |> Effects.task

        ( newModel, _ ) =
          init
      in
        ( newModel, fx )
