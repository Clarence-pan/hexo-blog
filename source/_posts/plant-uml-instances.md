title: PlantUML的实例参考
date: 2015-12-24
update: 
tags: 
  - PlantUML
  - UML
categories: 
  - UML
----

![](/media/14508871765386/14508873043317.jpg)

```uml

Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response

```

---

![](/media/14508871765386/14508873876653.jpg)

```uml

actor Foo1
boundary Foo2
control Foo3
entity Foo4
database Foo5
Foo1 -> Foo2 : To boundary
Foo1 -> Foo3 : To control
Foo1 -> Foo4 : To entity
Foo1 -> Foo5 : To database

```

---

![](/media/14508871765386/14508874581737.jpg)

```uml

actor Bob #red
' The only difference between actor
'and participant is the drawing
participant Alice
participant "I have a really\nlong name" as L #99FF99
/' You can also declare:
   participant L as "I have a really\nlong name"  #99FF99
  '/

Alice->Bob: Authentication Request
Bob->Alice: Authentication Response
Bob->L: Log transaction

```

---

![](/media/14508871765386/14508875415584.jpg)

```uml

Alice -> "Bob()" : Hello
"Bob()" -> "This is very\nlong" as Long
' You can also declare:
' "Bob()" -> Long as "This is very\nlong"
Long --> "Bob()" : ok

```

---

![](/media/14508871765386/14508876062052.jpg)

```uml

Alice->Alice: This is a signal to self.\nIt also demonstrates\nmultiline \ntext

```

---

![](/media/14508871765386/14508876691388.jpg)


```uml

Bob ->x Alice
Bob -> Alice
Bob ->> Alice
Bob -\ Alice
Bob \\- Alice
Bob //-- Alice

Bob ->o Alice
Bob o\\-- Alice

Bob <-> Alice
Bob <->o Alice

```

---

![](/media/14508871765386/14508877906015.jpg)

```uml

Bob -[#red]> Alice : hello
Alice -[#0000FF]->Bob : ok

autonumber
Bob -> Alice : Authentication Request
Bob <- Alice : Authentication Response


autonumber 15
Bob -> Alice : Another authentication Request
Bob <- Alice : Another authentication Response

autonumber 40 10
Bob -> Alice : Yet another authentication Request
Bob <- Alice : Yet another authentication Response


autonumber "<b>[000]"
Bob -> Alice : Authentication Request
Bob <- Alice : Authentication Response

autonumber 15 "<b>(<u>##</u>)"
Bob -> Alice : Another authentication Request
Bob <- Alice : Another authentication Response

autonumber 40 10 "<font color=red><b>Message 0  "
Bob -> Alice : Yet another authentication Request
Bob <- Alice : Yet another authentication Response

```

---

![](/media/14508871765386/14508878845770.jpg)


```uml

title Simple communication example

Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob : Hello
legend right
  Short
  legend
endlegend

```

---

![](/media/14508871765386/14508880026002.jpg)


```uml


Alice -> Bob : message 1
Alice -> Bob : message 2

newpage

Alice -> Bob : message 3
Alice -> Bob : message 4

newpage A title for the\nlast page

Alice -> Bob : message 5
Alice -> Bob : message 6

```

---

![](/media/14508871765386/14508880581805.jpg)


```uml

Alice -> Bob: Authentication Request

alt successful case

    Bob -> Alice: Authentication Accepted
    
else some kind of failure

    Bob -> Alice: Authentication Failure
    group My own label
    	Alice -> Log : Log attack start
        loop 1000 times
            Alice -> Bob: DNS Attack
        end
    	Alice -> Log : Log attack end
    end
    
else Another type of failure

   Bob -> Alice: Please repeat
   
end

```

---

![](/media/14508871765386/14508881008619.jpg)

```uml

Alice->Bob : hello
note left: this is a first note

Bob->Alice : ok
note right: this is another note

Bob->Bob : I am thinking
note left
	a note
	can also be defined
	on several lines
end note

```

---

![](/media/14508871765386/14508881512034.jpg)

```uml

participant Alice
participant Bob
note left of Alice #aqua
	This is displayed 
	left of Alice. 
end note
 
note right of Alice: This is displayed right of Alice.

note over Alice: This is displayed over Alice.

note over Alice, Bob #FFAAAA: This is displayed\n over Bob and Alice.

note over Bob, Alice
	This is yet another
	example of
	a long note.
end note
```

---

![](/media/14508871765386/14508882023621.jpg)

```uml
caller -> server : conReq
hnote over caller : idle
caller <- server : conConf
rnote over server
 "r" as rectangle
 "h" as hexagon
endrnote
```

---

![](/media/14508871765386/14508882698374.jpg)


```uml

participant Alice
participant "The **Famous** Bob" as Bob

Alice -> Bob : hello --there--
... Some ~~long delay~~ ...
Bob -> Alice : ok
note left
  This is **bold**
  This is //italics//
  This is ""monospaced""
  This is --stroked--
  This is __underlined__
  This is ~~waved~~
end note

Alice -> Bob : A //well formatted// message
note right of Alice 
 This is <back:cadetblue><size:18>displayed</size></back> 
 __left of__ Alice. 
end note
note left of Bob 
 <u:red>This</u> is <color #118888>displayed</color> 
 **<color purple>left of</color> <s:red>Alice</strike> Bob**. 
end note
note over Alice, Bob
 <w:#FF33FF>This is hosted</w> by <img sourceforge.jpg>
end note 

```

---

![](/media/14508871765386/14508883127897.jpg)

```uml


== Initialization ==

Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

== Repetition ==

Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response

```

---

![](/media/14508871765386/14508883507270.jpg)

```uml

participant Alice
actor Bob

ref over Alice, Bob : init

Alice -> Bob : hello

ref over Bob
  This can be on
  several lines
end ref
```

---

![](/media/14508871765386/14508884666136.jpg)

```uml

Alice -> Bob: Authentication Request
...
Bob --> Alice: Authentication Response
...5 minutes latter...
Bob --> Alice: Bye !

```

---

![](/media/14508871765386/14508885234862.jpg)

```uml

Alice -> Bob: message 1
Bob --> Alice: ok
|||
Alice -> Bob: message 2
Bob --> Alice: ok
||45||
Alice -> Bob: message 3
Bob --> Alice: ok

```

---

![](/media/14508871765386/14508885743513.jpg)

```uml

participant User

User -> A: DoWork
activate A

A -> B: << createRequest >>
activate B

B -> C: DoWork
activate C
C --> B: WorkDone
destroy C

B --> A: RequestCreated
deactivate B

A -> User: Done
deactivate A

```

---

![](/media/14508871765386/14508886169018.jpg)

```uml

participant User

User -> A: DoWork
activate A #FFBBBB

A -> A: Internal call
activate A #DarkSalmon

A -> B: << createRequest >>
activate B

B --> A: RequestCreated
deactivate B
deactivate A
A -> User: Done
deactivate A

```

---

![](/media/14508871765386/14508886596930.jpg)

```uml

Bob -> Alice : hello

create Other
Alice -> Other : new

create control String
Alice -> String
note right : You can also put notes!

Alice --> Bob : ok

```

---

![](/media/14508871765386/14508887046884.jpg)

```uml

[-> A: DoWork

activate A

A -> A: Internal call
activate A

A ->] : << createRequest >>

A<--] : RequestCreated
deactivate A
[<- A: Done
deactivate A

```

---

![](/media/14508871765386/14508887563841.jpg)

```uml

[-> Bob
[o-> Bob
[o->o Bob
[x-> Bob

[<- Bob
[x<- Bob

Bob ->]
Bob ->o]
Bob o->o]
Bob ->x]

Bob <-]
Bob x<-]
```

---

![](/media/14508871765386/14508872101419.jpg)

```uml
@startuml

/'
This is an example Sequence diagram
Showing a fictional web feature flow
It is easy to see roles & responsibilities for each component
and easy to change them too...
'/

title "Story Feature Example - Sequence Diagram"

'This is a single line comment

/'
This is a multi-line comment
One another line
'/

actor User
'boundary Proxy
participant UIServer as UI
participant API

User -> UI: LINK: goto /account page
activate UI
UI -> User:
deactivate UI

activate User
note over User
  Requirments:
  UI: Setting Page
  Click delete button
end note

' user requests account/delete page
User -> UI: /account/delete
deactivate User
activate UI
UI -> User:
deactivate UI

' confirmation form
activate User
note over User
  UI: Form
  Are you sure?
end note


User -> UI: POST /account/delete
deactivate User
activate UI

note over UI: Verify: user has confirmed
UI -> API: /account/delete
activate API
API -> API: delete
API -> UI: done
deactivate API
UI -> User: success
deactivate UI

@enduml

```

---



