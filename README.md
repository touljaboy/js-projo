# js-projo
Sample description (we dont have a name yet)
## Figma link
[here](https://www.figma.com/design/o9R40oH8H8XGoBdjUeI7Fi/Komunikator-sample-name-project?node-id=0-1&p=f&t=nlronAcqX1bIMXgW-0)
## DB Plan
Added db plan under the db folder. There, you can also see a drawio file, which you can load to [draw.io](https://app.diagrams.net/)

**Notes**
- Added a new entity: Conversation. It is meant for more convenient and faster load of conversations between two users
- Edited the fields on current entities to use best practice, like collecting metadata and having atomic fields
- Passwords should be encrypted and not stored as plain text according to best practices.
**Todos**
- Ideally, if time allows, we should have some indexes to optimize message lookups