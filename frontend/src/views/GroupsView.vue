<script setup>
import { ref } from 'vue'

// Adding comments for others to understand the code well, as not everyone has experience with vue
// @ - means the src folder
import defaultImage from '@/assets/sample-group-photo.jpg'

// ref means that vue will follow changes of a certain element and update it before our eyes!

// group list with one from the start
const groups = ref([
    {
        id: 1,
        name: 'JS-Projo',
        isPublic: true,
        image: defaultImage
    }
])

// Here we enter group name etc
const newGroupName = ref('')
const newGroupIsPublic = ref(false)
// current group id
let currentId = 1

// Adding new group
const addGroup = () => {
    if (newGroupName.value.trim() === '') return // cannot add blank group name

    groups.value.push({
    id: ++currentId,
    name: newGroupName.value,
    isPublic: newGroupIsPublic.value,
    // random picture from the internet
    image: `https://picsum.photos/seed/${newGroupName.value}/200/150`
    })

    console.log(currentId)
    // clean the form after adding
    newGroupName.value = ''
    newGroupIsPublic.value = false
}

// delete group
const removeGroup = (id) => {
    // retain groups with id other than the one that is deleted
    groups.value = groups.value.filter(group => group.id !== id)
}
</script>

<template>
    <div class="container">
        <h1>Grupy</h1>

        <div class="add-form">
            <input 
            v-model="newGroupName" 
            placeholder="Wpisz nazwę grupy..." 
            type="text"
            @keyup.enter="addGroup" 
            />

            <label>
            <input type="checkbox" v-model="newGroupIsPublic">
            Publiczna?
            </label>

            <button @click="addGroup">Dodaj</button>
        </div>

        <div class="groups-list">
            <p v-if="groups.length === 0">Brak grup.</p>

            <div v-for="group in groups" :key="group.id" class="card">
                <img :src="group.image" alt="Obrazek grupy" />

                <div class="card-content">
                    <h3>{{ group.name }}</h3>
                    <p>
                    Status: 
                    <span v-if="group.isPublic">🔓 Publiczna</span>
                    <span v-else>🔒 Prywatna</span>
                    </p>

                    <button class="delete-btn" @click="removeGroup(group.id)">Usuń</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container { max-width: 600px; margin: 0 auto; font-family: sans-serif; }
.add-form { display: flex; gap: 10px; margin-bottom: 20px; padding: 20px; background: #f0f0f0; border-radius: 8px; align-items: center; }
.add-form input[type="text"] { padding: 8px; flex-grow: 1; }
.add-form button { padding: 8px 16px; background: #42b883; color: white; border: none; cursor: pointer; border-radius: 4px; }
.add-form button:hover { background: #33a06f; }

.groups-list { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
.card img { width: 100%; height: 150px; object-fit: cover; }
.card-content { padding: 10px; }
.delete-btn { background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;}
</style>