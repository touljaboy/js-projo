// -----------------------------
// GROUP SERVICE (MOCK DB)
// -----------------------------

let groups = [
    {
        id: 101,
        name: "kotki",
        is_public: true,
        password: null, // public group
        created_at: new Date('2025-01-15T10:00:00Z').toISOString()
    },
    {
        id: 102,
        name: "pieski",
        is_public: false,
        password: 'securehash', // private group
        created_at: new Date('2025-02-20T14:30:00Z').toISOString()
    }
];

let nextGroupId = 103;

// -----------------------------------------
// GET ALL
// -----------------------------------------
exports.getAll = () => {
    // Return all groups, omitting the sensitive password field for safety
    return groups.map(({ password, ...group }) => group);
};

// -----------------------------------------
// GET ONE BY ID
// -----------------------------------------
exports.getOne = (id) => {
    const group = groups.find(g => g.id === id);

    if (!group) {
        // Throw 404 error for the controller to catch
        throw { status: 404, message: 'Grupa nie istnieje' };
    }
    
    // Omit password before returning
    const { password, ...safeGroup } = group;
    return safeGroup;
};

// -----------------------------------------
// CREATE GROUP
// -----------------------------------------
exports.create = (name, is_public, password) => {
    
    // 1. Core Validation
    if (!name || is_public === undefined) {
        throw { status: 400, message: 'Brak wymaganych pól, np nazwy grupy lub informacji czy jest publiczna' };
    }

    // 2. Logic Validation
    if (is_public && password) {
        throw { status: 400, message: 'Nie można utworzyć publicznej grupy z haslem' };
    } else if (!is_public && !password) {
        throw { status: 400, message: 'Brak hasla do prywatnej grupy' };
    }
    
    // 3. Create object
    const newGroup = {
        id: nextGroupId++,
        name,
        is_public,
        password: is_public ? null : password,
        created_at: new Date().toISOString()
    };

    // 4. Save and return
    groups.push(newGroup);
    
    // Return safe version (without password)
    const { password: _, ...safeGroup } = newGroup;
    return safeGroup;
};


// -----------------------------------------
// PUT (FULL REPLACE)
// -----------------------------------------
exports.replace = (id, name, is_public, password) => {
    const index = groups.findIndex(g => g.id === id);

    if (index === -1) {
        throw { status: 404, message: 'Grupa nie istnieje' };
    }
    
    // 1. Core Validation
    if (!name || is_public === undefined) {
        throw { status: 400, message: 'Brak wymaganych pól: name, is_public' };
    }

    // 2. Logic Validation
    if (is_public && password) {
        throw { status: 400, message: 'Publiczna grupa nie może mieć hasła' };
    }
    if (!is_public && !password) {
        throw { status: 400, message: 'Prywatna grupa musi mieć hasło' };
    }
    
    // 3. Create updated object
    const updatedGroup = {
        id: id,
        name,
        is_public,
        password: is_public ? null : password,
        created_at: groups[index].created_at, // Keep original creation date
        updated_at: new Date().toISOString() // Add update timestamp
    };

    // 4. Replace in array
    groups[index] = updatedGroup;
    
    // Return safe version (without password)
    const { password: _, ...safeGroup } = updatedGroup;
    return safeGroup;
};


// -----------------------------------------
// DELETE GROUP
// -----------------------------------------
exports.remove = (id) => {
    const index = groups.findIndex(g => g.id === id);

    if (index === -1) {
        throw { status: 404, message: 'Grupa nie istnieje' };
    }

    const [deleted] = groups.splice(index, 1);
    
    // Return safe version (without password)
    const { password: _, ...safeGroup } = deleted;
    return safeGroup;
};