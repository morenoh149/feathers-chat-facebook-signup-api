module Models exposing (..)

import Time exposing (Time)


type Msg
  = NewMessage Message
  | NewUser User
  | Typing String
  | SendMessage
  | Logout


type alias Model =
  { textbox : String
  , messages : List Message
  , users : List User
  }


type alias User =
  { avatar : String
  , email : String
  }


type alias Message =
  { text : String
  , sentBy : User
  , createdAt : Time
  }
