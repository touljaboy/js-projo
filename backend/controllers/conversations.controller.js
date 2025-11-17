const convService = require('../services/conversations.service');

exports.getAll = (req, res) => {
  const { user_a_id, user_b_id } = req.query;

  try {
    const result = convService.getAll(user_a_id, user_b_id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.getOne = (req, res) => {
  const id = parseInt(req.params.id);
  const conv = convService.getOne(id);

  if (!conv) {
    return res.status(404).json({ error: `Konwersacja o ID ${id} nie istnieje.` });
  }

  res.json(conv);
};

exports.create = (req, res) => {
  const { user_a_id, user_b_id } = req.body;

  try {
    const newConv = convService.create(user_a_id, user_b_id);
    res.status(201).json(newConv);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { last_message_at } = req.body;

  try {
    const updated = convService.update(id, last_message_at);
    res.json({ message: 'Zaktualizowano konwersację.', updated });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.remove = (req, res) => {
  const id = parseInt(req.params.id);

  try {
    convService.remove(id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.replace = (req, res) => {
  const { id } = req.params;
  const { user_a_id, user_b_id, last_message_at } = req.body;

  if (!user_a_id || !user_b_id) {
    return res.status(400).json({
      error: "PUT wymaga pełnych danych: user_a_id i user_b_id."
    });
  }

  try {
    const updated = convService.replace(id, {
      user_a_id,
      user_b_id,
      last_message_at
    });

    if (!updated) {
      return res.status(404).json({ error: `Konwersacja o ID ${id} nie istnieje.` });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};