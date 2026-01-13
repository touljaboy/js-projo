function seedIfEmpty(db, tableName, insertSql, rows) {
  const count = db.prepare(`SELECT COUNT(*) AS c FROM ${tableName}`).get().c;
  if (count !== 0) return;

  const insert = db.prepare(insertSql);

  db.transaction(() => {
    for (const row of rows) insert.run(...row);
  })();
}

module.exports = function seed(db) {
  // users
  seedIfEmpty(
    db,
    'users',
    `INSERT INTO users (id, user, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)`,
    [
      [1, 'brian', 'mockhash1', 'user', new Date().toISOString()],
      [2, 'joshua', 'mockhash2', 'user', new Date().toISOString()],
      [3, 'mirabell', 'mockhash3', 'user', new Date().toISOString()],
      [4, 'admin', 'admin123', 'admin', new Date().toISOString()],
    ]
  );

  // groups
  seedIfEmpty(
    db,
    'groups',
    `INSERT INTO groups (id, name, is_public, password, creator_id, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      [1, 'kotki', 1, null, 1, new Date('2025-01-15T10:00:00Z').toISOString()],
      [2, 'pieski', 0, 'securehash', 1, new Date('2025-02-20T14:30:00Z').toISOString()],
    ]
  );

  // user_groups
  seedIfEmpty(
    db,
    'user_groups',
    `INSERT INTO user_groups (id, user_id, group_id, joined_at) VALUES (?, ?, ?, ?)`,
    [
      [1, 1, 101, new Date('2025-03-01T10:00:00Z').toISOString()],
      [2, 2, 101, new Date('2025-03-01T10:00:00Z').toISOString()],
      [3, 1, 102, new Date('2025-03-05T11:00:00Z').toISOString()],
    ]
  );

  // conversations
  seedIfEmpty(
    db,
    'conversations',
    `INSERT INTO conversations (id, user_a_id, user_b_id, last_message_at) VALUES (?, ?, ?, ?)`,
    [
      [1, 1, 2, new Date('2025-05-10T08:00:00Z').toISOString()],
      [2, 1, 3, null],
    ]
  );

  // messages
  seedIfEmpty(
    db,
    'messages',
    `INSERT INTO messages (message_id, conversation_id, sender_id, receiver_group_id, message_content, sent_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      [1, 201, 1, null, 'Cześć Ewa, jak się masz?', new Date('2025-05-10T07:59:00Z').toISOString()],
      [2, null, 2, 101, 'Witajcie w grupie publicznej!', new Date('2025-05-10T08:05:00Z').toISOString()],
      [3, 201, 2, null, 'Dobrze, dzięki! A Ty?', new Date('2025-05-10T08:00:00Z').toISOString()],
    ]
  );
};
