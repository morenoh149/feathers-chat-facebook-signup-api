port module Main exposing (..)

import Html exposing (..)
import Html.App exposing (..)
import View exposing (view)
import Models exposing (..)
import Task exposing (Task)


main =
  Html.App.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


port usersPort : (User -> user) -> Sub user
port messagesIn : (Message -> msg) -> Sub msg
port sendMessage : String -> Cmd msg
port logoutPort : () -> Cmd msg

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch [ messagesIn NewMessage
            , usersPort NewUser
            ]


init : ( Model, Cmd Msg )
init =
  let
    model =
      { textbox = ""
      , messages = []
      , users = []
      }
  in
    ( model, Cmd.none )


newList : List Message -> Message -> List Message
newList list message =
  List.append list [ message ]
    |> List.sortBy .createdAt


update : Msg -> Model -> ( Model, Cmd Msg )
update action model =
  case action of
    NewMessage message ->
      ( { model | messages = newList model.messages message }, Cmd.none )

    NewUser user ->
      ( { model | users = List.append model.users [ user ] }, Cmd.none )

    Typing value ->
      ( { model | textbox = value }, Cmd.none )

    SendMessage ->
      ( { model | textbox = "" }, sendMessage model.textbox )

    Logout ->
      let
        ( newModel, _ ) =
          init
      in
        ( newModel, logoutPort ())
