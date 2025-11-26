# Yapchat - project for Javascript programming classes
YapChat is a powerful, yet incredibly easy-to-use communication app designed to keep you closer to the people who matter most.
## Figma link - The Whole Team
[here](https://www.figma.com/design/o9R40oH8H8XGoBdjUeI7Fi/Komunikator-sample-name-project?node-id=0-1&p=f&t=nlronAcqX1bIMXgW-0)
## DB Plan - Ernest
Added db plan under the db folder. There, you can also see a drawio file, which you can load to [draw.io](https://app.diagrams.net/)

**Notes**
- Added a new entity: Conversation. It is meant for more convenient and faster load of conversations between two users
- Edited the fields on current entities to use best practice, like collecting metadata and having atomic fields
- Passwords should be encrypted and not stored as plain text according to best practices.

**Todos (besides stuff on project website on github)**
- Ideally, if time allows, we should have some indexes to optimize message lookups, but first create db right


# BACKEND

## How to run?
After you pull the git project on your machine, navigate to the backend folder and enter:
```
npm install
```
and you will install all of the dependencies which make the server work (like express).

You can then run:
```
npm run dev
```
and the server is ready! (ctrl+c to stop it).
Since we've got nodemon, updates to code update the website!

Enter in your browser and see for yourself!
```
localhost:3000/v1/health
```

# API Documentation (v1)

This document outlines the endpoints, methods, request bodies, and responses for the API services, including Users, Groups, Messages, and Health.

All endpoints should follow this naming convention: /v1/<endpoint>

If searching for specific id add '/:id' at the end (e.g /v1/groups/:id)



## Health Check

### GET /v1/health

Checks the server health.

| Response Code | Body | Description |
| :--- | :--- | :--- |
| **200 OK** | `"Saul Goodman 8|"` | Server is running and healthy. |

---

## User Endpoints (`/v1/users`)

### GET /v1/users

Retrieves a list of all registered users.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| None | | |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `[{ id: 1, user: "brian", created_at: "..." }, ...]` | Success. Returns an array of user objects. |

### GET /v1/users/:id

Retrieves a single user by their ID.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the user. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ id: 1, user: "brian", created_at: "..." }` | Success. Returns the user object. |
| **404 Not Found** | `{ error: "Użytkownik o ID X nie został znaleziony." }` | User with the given ID does not exist. |

### POST /v1/users

Creates a new user account.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **user** | `string` | Yes | The desired username. |
| **password_hash** | `string` | Yes | The hashed password. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **201 Created** | `{ id: 4, user: "newuser", password_hash: "...", created_at: "..." }` | User successfully created. Returns the new user object. |
| **400 Bad Request** | `{ error: "Brak wymaganych pól: user, password_hash" }` | Missing required fields. |

### PATCH /v1/users/:id

Performs a partial update (modify one or both fields) on an existing user.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the user to update. |

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **user** | `string` | No | New username. |
| **password_hash** | `string` | No | New hashed password. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ id: 1, user: "brian_updated", ... }` | User successfully updated. Returns the updated user object. |
| **400 Bad Request** | `{ error: "Brak danych do aktualizacji." }` | Request body is empty. |
| **404 Not Found** | `{ error: "Użytkownik o ID X nie został znaleziony." }` | User with the given ID does not exist. |

### DELETE /v1/users/:id

Deletes a user account by ID.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the user to delete. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ message: "Użytkownik usunięty.", deleted: {...} }` | User successfully deleted. Returns the deleted user object. |
| **404 Not Found** | `{ error: "Użytkownik o ID X nie został znaleziony." }` | User with the given ID does not exist. |

---

## Group Endpoints (`/v1/groups`)

### GET /v1/groups

Retrieves a list of all groups (public and private). **Note:** Password field is omitted from the response for security.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| None | | |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `[{ id: 101, name: "kotki", is_public: true, ... }, ...]` | Success. Returns an array of group objects. |

### GET /v1/groups/:id

Retrieves a single group by ID. **Note:** Password field is omitted from the response for security.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the group. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ id: 101, name: "kotki", is_public: true, ... }` | Success. Returns the group object. |
| **404 Not Found** | `{ error: "Grupa nie istnieje" }` | Group with the given ID does not exist. |

### POST /v1/groups

Creates a new group. Requires logical validation for `is_public` and `password`.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **name** | `string` | Yes | The name of the group. |
| **is_public** | `boolean` | Yes | Must be `true` or `false`. |
| **password** | `string` | Conditional | **Required** if `is_public` is `false`. Must be omitted/null if `is_public` is `true`. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **201 Created** | `{ id: 103, name: "nowa", ... }` | Group successfully created. Returns the new group object. |
| **400 Bad Request** | `{ error: "Nie można utworzyć publicznej grupy z haslem" }` | Group creation validation failed (e.g., public group with password). |

### PUT /v1/groups/:id

Fully replaces an existing group's data. All required fields must be provided, and validation rules apply.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the group to replace. |

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **name** | `string` | Yes | The new name of the group. |
| **is_public** | `boolean` | Yes | The new public status. |
| **password** | `string` | Conditional | **Required** if `is_public` is `false`. Must be omitted/null if `is_public` is `true`. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ id: 101, name: "updated_name", ... }` | Group successfully replaced. Returns the updated group object. |
| **400 Bad Request** | `{ error: "Publiczna grupa nie może mieć hasła" }` | Validation failed. |
| **404 Not Found** | `{ error: "Grupa nie istnieje" }` | Group with the given ID does not exist. |

### DELETE /v1/groups/:id

Deletes a group by ID.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the group to delete. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ message: "Grupa usunięta.", deleted: {...} }` | Group successfully deleted. Returns the deleted group object. |
| **404 Not Found** | `{ error: "Grupa nie istnieje" }` | Group with the given ID does not exist. |

---

## Message Endpoints (`/v1/messages`)

### GET /v1/messages

Retrieves a list of all messages.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| None | | |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `[{ message_id: 301, message_content: "...", sent_at: "..." }, ...]` | Success. Returns an array of message objects. |

### GET /v1/messages/:id

Retrieves a single message by ID.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the message. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ message_id: 301, message_content: "...", sent_at: "..." }` | Success. Returns the message object. |
| **404 Not Found** | `{ error: "Wiadomość o ID X nie została znaleziona." }` | Message with the given ID does not exist. |

### POST /v1/messages

Creates a new message.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **sender_id** | `integer` | Yes | The ID of the user sending the message. |
| **message_content** | `string` | Yes | The content of the message. |
| **conversation_id** | `integer` | No | ID of the 1-on-1 conversation (optional, defaults to `null`). |
| **receiver_group_id** | `integer` | No | ID of the group receiving the message (optional, defaults to `null`). |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **201 Created** | `{ message_id: 304, ... }` | Message successfully sent. Returns the new message object. |
| **400 Bad Request** | `{ error: "Brak wymaganych pól: sender_id and message_content" }` | Missing required fields. |

### PATCH /v1/messages/:id

Partially updates (edits) the content of an existing message. This updates the `message_content` and sets a new `sent_at` timestamp.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the message to update. |

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **message_content** | `string` | Yes | The new content of the message. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ message_id: 301, message_content: "New content", sent_at: "..." }` | Message successfully updated. Returns the updated message object. |
| **400 Bad Request** | `{ error: "Brak tresci wiadomosci do aktualizacji." }` | Missing `message_content` field. |
| **404 Not Found** | `{ error: "Wiadomość o ID X nie została znaleziona." }` | Message with the given ID does not exist. |

### DELETE /v1/messages/:id

Deletes a message by ID.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the message to delete. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ message: "Wiadomość usunięta", deleted: {...} }` | Message successfully deleted. Returns the deleted message object. |
| **404 Not Found** | `{ error: "Wiadomość o ID X nie została znaleziona." }` | Message with the given ID does not exist. |

## User Group Endpoints (`/v1/usergroups`)

This resource manages the relationship between a user and a group (i.e., membership).

### GET /v1/usergroups

Retrieves all user-group relationships, with optional filtering.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **user_id** | `integer` | Optional. Filter relations by this user ID. |
| **group_id** | `integer` | Optional. Filter relations by this group ID. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `[{ id: 1, user_id: 1, group_id: 101, joined_at: "..." }, ...]` | Success. Returns an array of user group relation objects. |

### GET /v1/usergroups/:id

Retrieves a single user-group relation by its ID.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the relationship. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ id: 1, user_id: 1, group_id: 101, joined_at: "..." }` | Success. Returns the relation object. |
| **404 Not Found** | `{ error: "Relacja o ID X nie istnieje." }` | Relation with the given ID does not exist. |

### POST /v1/usergroups

Creates a new user-group relationship (adds a user to a group).

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **user_id** | `integer` | Yes | The ID of the user to add. |
| **group_id** | `integer` | Yes | The ID of the group to join. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **201 Created** | `{ id: 4, user_id: 3, group_id: 101, joined_at: "..." }` | Relation successfully created. |
| **400 Bad Request** | `{ error: "Brak wymaganych pól: user_id, group_id." }` | Missing required fields. |
| **409 Conflict** | `{ error: "Użytkownik 3 już należy do grupy 101." }` | The user is already a member of the group. |

### PATCH /v1/usergroups/:id

Updates the relationship (e.g., changes the group ID for a user, though this is rare in practice).

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the relation to update. |

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **user_id** | `integer` | No | New user ID for the relation. |
| **group_id** | `integer` | No | New group ID for the relation. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ id: 1, group_id: 102, ... }` | Relation successfully updated. |
| **404 Not Found** | `{ error: "Relacja o ID X nie istnieje." }` | Relation with the given ID does not exist. |
| **409 Conflict** | `{ error: "Użytkownik X już należy do grupy Y." }` | Update causes a duplicate relationship. |

### PUT /v1/usergroups/:id

Fully replaces an existing user-group relation with new data.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the relation to replace. |

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **user_id** | `integer` | Yes | New user ID. |
| **group_id** | `integer` | Yes | New group ID. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ id: 1, user_id: 2, group_id: 102, ... }` | Relation successfully replaced. |
| **404 Not Found** | `{ error: "Relacja o ID X nie istnieje." }` | Relation with the given ID does not exist. |
| **409 Conflict** | `{ error: "Użytkownik X już należy do grupy Y." }` | New data causes a duplicate relationship. |

### DELETE /v1/usergroups/:id

Removes a user-group relationship (removes a user from a group).

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the relation to remove. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ message: "Relacja usunięta", deleted: {...} }` | Relation successfully removed. |
| **404 Not Found** | `{ error: "Relacja o ID X nie istnieje." }` | Relation with the given ID does not exist. |

---

## Conversation Endpoints (`/v1/conversations`)

This resource manages the context for 1-on-1 private messaging.

### GET /v1/conversations

Retrieves a list of all conversations (e.g., all conversations a specific user is part of).

| Parameter | Type | Description |
| :--- | :--- | :--- |
| None | | |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `[{ id: 201, participant_ids: [1, 2], created_at: "..." }, ...]` | Success. Returns an array of conversation objects. |

### GET /v1/conversations/:id

Retrieves a single conversation by ID.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the conversation. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ id: 201, participant_ids: [1, 2], created_at: "..." }` | Success. Returns the conversation object. |
| **404 Not Found** | `{ error: "Konwersacja o ID X nie została znaleziona." }` | Conversation with the given ID does not exist. |

### POST /v1/conversations

Initiates a new private conversation between two users.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **participant_id_1** | `integer` | Yes | The ID of the first user. |
| **participant_id_2** | `integer` | Yes | The ID of the second user. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **201 Created** | `{ id: 202, participant_ids: [3, 4], created_at: "..." }` | Conversation successfully initiated. |
| **400 Bad Request** | `{ error: "Brak wymaganych pól: participant_id_1, participant_id_2" }` | Missing required fields. |
| **409 Conflict** | `{ error: "Konwersacja między tymi użytkownikami już istnieje." }` | Conversation already exists between the two users. |

### DELETE /v1/conversations/:id

Deletes or archives a conversation by ID.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **:id** | `integer` | The unique ID of the conversation to delete. |

| Response Code | Body (Example) | Description |
| :--- | :--- | :--- |
| **200 OK** | `{ message: "Konwersacja usunięta", deleted: {...} }` | Conversation successfully deleted. |
| **404 Not Found** | `{ error: "Konwersacja o ID X nie została znaleziona." }` | Conversation with the given ID does not exist. |
---

# FRONTEND

## How to run?
0. First, make sure you've got latest version of node. I recommend using nvm. You can check how to install it in "Other stuff" section.

1. Navigate to the frontend folder.
2. Before first run, execute ``` npm install ```
3. Then run ``` npm run dev ```


# 'Other stuff' section
### Project initialization in node.js + express (backend) - Ernest (but I recommend whole team try for yourself in a separate project!)
**Steps followed (on ubuntu, but you may use WSL I guess):**
1. ```sudo apt update```
2. Install nodejs and npm ```sudo apt install nodejs npm -y``` Notes for the team: NPM is node package manager, so you can have many versions of node on a single machine with separate packages installed and just activate them and manage EASILY. 
3. Verify install ```node -v && npm -v```

4. ```mkdir backend && cd backend```
5. Initialize npm project ```npm init -y```
6. Install express ```npm install express```
7. Install nodemon (smth like a liveserver) ```npm install --save-dev nodemon```

### Frontend initialization using node.js + vue - Ernest
1. Make sure you've got latest node.js, I'm using nvm. Install nvm
1. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
1. nvm install --lts
1. npm create vue@latest