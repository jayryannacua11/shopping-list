const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBTn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate Input
    if(newItem === ''){
        alert('Please add an item');
        return;
    }

    // console.log(('Success'));

    // Check if edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        if(checkIfItemExists(newItem)){
            alert('That Item already exists!');
            return;
        }

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if(checkIfItemExists(newItem)){
            alert('That Item already exists!');
            return;
        }
    }

    // Create item DOM Element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
}

const test = item => {
    console.log('test');
}

function addItemToDOM(item) {
    // Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');

    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);
}

const createButton = (classes) => {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon);
    return button;
}

const createIcon = (classes) => {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();

    // Add new item to array
    itemsFromStorage.push(item);

    // Covert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onItemClick(e) {
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    // const itemsFromStorage = getItemsFromStorage();

    // return itemsFromStorage.includes(item);
    // // This is the long version
    // // if(itemsFromStorage.includes(item)){
    // //     return true;
    // // } else return false;

    const itemsFromStorage = getItemsFromStorage().map(i => i.toLowerCase());
    return itemsFromStorage.includes(item.trim().toLowerCase());

}

const setItemToEdit = item => {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBTn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBTn.style.backgroundColor = '#228b22';
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if(confirm('Are you sure?')) {
        // Remove item from DOM
        item.remove();

        // Remove item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
};

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    // console.log(itemsFromStorage);
    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Reset to localstorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

const clearItems = () => {
    while (itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    // Clear from localStorage
    localStorage.removeItem('items')

    checkUI();
}

const filterItems = e => {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        }else {
            item.style.display = 'none';
        }
    });
}

function checkUI() {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    
    if(items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBTn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBTn.style.backgroundColor = '#333';

    isEditMode = false;
}


// Initialize app
function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onItemClick);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();
