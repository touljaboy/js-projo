const userGroupsService = require('../services/userGroups.service');

exports.getAll = (req, res) => {
  const { user_id, group_id } = req.query;

  const result = userGroupsService.getAll(user_id, group_id);
  res.json(result);
};

exports.getOne = (req, res) => {
  const id = parseInt(req.params.id);
  const relation = userGroupsService.getOne(id);

  if (!relation) {
    return res.status(404).json({ error: `Relacja o ID ${id} nie istnieje.` });
  }

  res.json(relation);
};

exports.create = (req, res) => {
  const { user_id, group_id } = req.body;

  try {
    const newUG = userGroupsService.create(user_id, group_id);
    res.status(201).json(newUG);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.update = (req, res) => {
  const id = parseInt(req.params.id);
  const { user_id, group_id } = req.body;

  try {
    const updated = userGroupsService.update(id, user_id, group_id);
    res.json({ message: 'Zaktualizowano relację.', updated });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.replace = (req, res) => {
  const { id } = req.params;
  const { user_id, group_id } = req.body;

  if (!user_id || !group_id) {
    return res.status(400).json({
      error: 'PUT wymaga pełnych danych: user_id i group_id.'
    });
  }

  try {
    const updated = userGroupsService.replace(id, { user_id, group_id });

    if (!updated) {
      return res.status(404).json({ error: `Relacja o ID ${id} nie istnieje.` });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.remove = (req, res) => {
  const id = parseInt(req.params.id);

  try {
    userGroupsService.remove(id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
