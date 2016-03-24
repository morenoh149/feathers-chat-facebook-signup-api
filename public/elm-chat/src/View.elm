module View (..) where

import Models exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on, keyCode, targetValue, onClick)
import List
import Time exposing (Time)
import Date exposing (fromTime)
import Date.Format exposing (format)
import Date.Config.Config_en_us as English
import Json.Decode as Json


message : Message -> Html
message msg =
  div
    [ class "message flex flex-row" ]
    [ img
        [ alt "test@test.com", class "avatar", src msg.sentBy.avatar ]
        []
    , div
        [ class "message-wrapper" ]
        [ p
            [ class "message-header" ]
            [ span
                [ class "username font-600" ]
                [ text msg.sentBy.email ]
            , span
                [ class "sent-date font-300" ]
                [ text <| formatTime msg.createdAt ]
            ]
        , p
            [ class "message-content font-300" ]
            [ text msg.text ]
        ]
    ]


user : User -> Html
user usr =
  li
    []
    [ a
        [ class "block relative", href "#" ]
        [ img
            [ alt "", class "avatar", src usr.avatar ]
            []
        , span
            [ class "absolute username" ]
            [ text usr.email ]
        ]
    ]


view : Signal.Address Action -> Model -> Html
view address model =
  div
    [ class "flex flex-column", id "app" ]
    [ header
        [ class "title-bar flex flex-row flex-center" ]
        [ div
            [ class "title-wrapper block center-element" ]
            [ img
                [ alt "Feathers Logo", class "logo", src "http://feathersjs.com/img/feathers-logo-wide.png" ]
                []
            , span
                [ class "title" ]
                [ text "Chat" ]
            ]
        ]
    , div
        [ class "flex flex-row flex-1 clear" ]
        [ aside
            [ class "sidebar col col-3 flex flex-column flex-space-between" ]
            [ header
                [ class "flex flex-row flex-center" ]
                [ h4
                    [ class "font-300 text-center" ]
                    [ span
                        [ class "font-600 online-count" ]
                        [ text <| toString <| List.length model.users ]
                    , text "users"
                    ]
                ]
            , ul
                [ class "flex flex-column flex-1 list-unstyled user-list" ]
                (List.map user model.users)
            , footer
                [ class "flex flex-row flex-center" ]
                [ a
                    [ class "logout button button-primary", onClick address Logout ]
                    [ text "Sign Out" ]
                ]
            ]
        , div
            [ class "flex flex-column col col-9" ]
            [ main'
                [ class "chat flex flex-column flex-1 clear" ]
                (List.map message model.messages)
            , div
                [ class "flex flex-row flex-space-between", id "send-message" ]
                [ input
                    [ class "flex flex-1"
                    , on "input" targetValue (Signal.message address << Typing)
                    , onEnter address SendMessage
                    , value model.textbox
                    ]
                    []
                , button
                    [ class "button-primary"
                    , onClick address SendMessage
                    ]
                    [ text "Send" ]
                ]
            ]
        ]
    ]


formatTime : Time -> String
formatTime time =
  let
    date =
      fromTime time
  in
    format English.config "%b %-d, %H:%M:%S" date


onEnter : Signal.Address a -> a -> Attribute
onEnter address value =
  on
    "keydown"
    (Json.customDecoder keyCode is13)
    (\_ -> Signal.message address value)


is13 : Int -> Result String ()
is13 code =
  if code == 13 then
    Ok ()
  else
    Err "not the right key code"
