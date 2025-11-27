// ----------------------
// !SERVER!
// ----------------------

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173' })); 
// (na devie możesz też dać po prostu app.use(cors()); )

app.use(express.json());

const userGroupsRouter = require('./routes/userGroups.routes');
app.use('/v1/usergroups', userGroupsRouter);

const conversationsRouter = require('./routes/conversations.routes');
app.use('/v1/convs', conversationsRouter);

const usersRouter = require("./routes/users.routes");
app.use("/v1/users", usersRouter);

const groupsRouter = require("./routes/groups.routes");
app.use("/v1/groups", groupsRouter);

const messagesRouter = require("./routes/messages.routes");
app.use("/v1/messages", messagesRouter);

// Health endpoint
app.get('/v1/health', (req, res) => {
  res.send('Saul Goodman 8|');
});

// Run the server
app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
  console.log(`Adress: http://localhost:${PORT}`);
});
