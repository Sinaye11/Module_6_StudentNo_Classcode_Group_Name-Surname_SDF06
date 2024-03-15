/*
Challenge:
Make it so that when you click the 'Add to cart' button, whatever is written in the input field should be console logged.
*/

// Imports for firebase connectivity 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, onValue, push, ref, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//Firebase database link 
const appSettings = {
    databaseURL: 'https://realtime-database-8b01f-default-rtdb.europe-west1.firebasedatabase.app/'
}
//Initializing and connecting to the firebase database
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
//Button 
addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value
    //Pushing information to the database
    push(shoppingListInDB, inputValue)

    clearInputField()

})
//Connected to the database and updates accordingly 
onValue(shoppingListInDB, function (snapshot) {//Gets us the snapshot that allows us to run the code below all over again

    if (snapshot.exists()) {

        //Getting an array with ID and values
        let itemsArray = Object.entries(snapshot.val())

        console.log(snapshot.val())
        //Clears what's in the list
        clearShoppingListEl()

        //Loop to iterate on itemsArray and console log every item
        for (let i = 0; i < itemsArray.length; i++) {
            //Getting the current item
            let currentItem = itemsArray[i]

            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            appendItemToShoppingListEl(itemsArray[i])
        }
    }
    else {
        //Whilst list is empty it will print the below
        shoppingListEl.innerHTML = "No items here... yet"
    }

})
//Clearing the previous listed item to avoid duplication 
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

//Input field will be cleared thanks to this function
function clearInputField() {
    inputFieldEl.value = ""
}
//Adding new item to the list
function appendItemToShoppingListEl(item) {

    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    //Attaching event listener to the newEl, in order to allow us to remove items from the list
    newEl.addEventListener("click", function () {
        //Removing items from the database
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)

}
