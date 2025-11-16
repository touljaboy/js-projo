// -----------------------------
// USER GROUPS SERVICE
// -----------------------------

let userGroups = [
    { id: 1, user_id: 1, group_id: 101, joined_at: new Date('2025-03-01T10:00:00Z') },
    { id: 2, user_id: 2, group_id: 101, joined_at: new Date('2025-03-01T10:00:00Z') },
    { id: 3, user_id: 1, group_id: 102, joined_at: new Date('2025-03-05T11:00:00Z') }
];

let nextUserGroupId = 4;


// -----------------------------------------
// GET ALL WITH OPTIONAL FILTERS
// -----------------------------------------
exports.getAll = (user_id, group_id) => {
    let result = [...userGroups];

    if (user_id) {
        result = result.filter(ug => ug.user_id === parseInt(user_id));
    }

    if (group_id) {
        result = result.filter(ug => ug.group_id === parseInt(group_id));
    }

    return result;
};


// -----------------------------------------
// GET ONE BY ID
// -----------------------------------------
exports.getOne = (id) => {
    return userGroups.find(ug => ug.id === id);
};


// -----------------------------------------
// CREATE RELATION
// -----------------------------------------
exports.create = (user_id, group_id) => {

    if (!user_id || !group_id) {
        throw { status: 400, message: "Brak wymaganych pól: user_id, group_id." };
    }

    const exists = userGroups.find(
        ug => ug.user_id === user_id && ug.group_id === group_id
    );

    if (exists) {
        throw { status: 409, message: `Użytkownik ${user_id} już należy do grupy ${group_id}.` };
    }

    const newUG = {
        id: nextUserGroupId++,
        user_id,
        group_id,
        joined_at: new Date()
    };

    userGroups.push(newUG);
    return newUG;
};


// -----------------------------------------
// PATCH (PARTIAL UPDATE)
// -----------------------------------------
exports.update = (id, user_id, group_id) => {
    const index = userGroups.findIndex(ug => ug.id === id);

    if (index === -1) {
        throw { status: 404, message: `Relacja o ID ${id} nie istnieje.` };
    }

    const relation = userGroups[index];

    // check for duplicates if group_id changes
    if (group_id && relation.group_id !== group_id) {
        const duplicate = userGroups.find(
            ug => ug.user_id === relation.user_id && ug.group_id === group_id
        );

        if (duplicate) {
            throw {
                status: 409,
                message: `Użytkownik ${relation.user_id} już należy do grupy ${group_id}.`
            };
        }
    }

    if (user_id !== undefined) relation.user_id = user_id;
    if (group_id !== undefined) relation.group_id = group_id;

    relation.joined_at = new Date();

    return relation;
};


// -----------------------------------------
// PUT (FULL REPLACE)
// -----------------------------------------
exports.replace = (id, data) => {
    const index = userGroups.findIndex(ug => ug.id === parseInt(id));

    if (index === -1) {
        return null;
    }

    const duplicate = userGroups.find(
        ug =>
            ug.user_id === data.user_id &&
            ug.group_id === data.group_id &&
            ug.id !== parseInt(id)
    );

    if (duplicate) {
        throw {
            status: 409,
            message: `Użytkownik ${data.user_id} już należy do grupy ${data.group_id}.`
        };
    }

    const newItem = {
        id: parseInt(id),
        user_id: data.user_id,
        group_id: data.group_id,
        joined_at: new Date()
    };

    userGroups[index] = newItem;

    return newItem;
};


// -----------------------------------------
// DELETE RELATION
// -----------------------------------------
exports.remove = (id) => {
    const initialLength = userGroups.length;

    userGroups = userGroups.filter(ug => ug.id !== id);

    if (userGroups.length === initialLength) {
        throw { status: 404, message: `Relacja o ID ${id} nie istnieje.` };
    }
};
