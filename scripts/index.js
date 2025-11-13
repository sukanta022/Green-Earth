const getCatagories = async () => {
    url = "https://openapi.programming-hero.com/api/categories"
    const response = await fetch(url);
    const data = await response.json();
    displayCatagories(data.categories);
    return data.categories;
}

const getAllTress = async () => {
    manageSpinner(true);
    const url = "https://openapi.programming-hero.com/api/plants";
    const response = await fetch(url);
    const data = await response.json();
    displayPlants(data.plants);
    return data.plants;
    
}


const displayCatagories = (data) => {
    const catagories = document.getElementById('categories-container');
    const allTreesBtn = document.createElement('div');
        allTreesBtn.innerHTML = `
            <button onclick="getAllTress(); activeClass(0)"  class="catagoryBtn btn btn-soft btn-success md:w-full text-black justify-start hover:bg-[#15803D] hover:text-white" id="category-0">All Trees</button>
        `
        catagories.append(allTreesBtn);
    data.forEach(catagory => {
        const catagoryBtn = document.createElement('div');
        catagoryBtn.innerHTML = `
            <button onclick="displayCatagoriesPlants('${catagory.category_name}'); activeClass(${catagory.id})" class="catagoryBtn btn btn-soft btn-success md:w-full text-black justify-start hover:bg-[#15803D] hover:text-white" id="category-${catagory.id}">${catagory.category_name}</button>
        `
        catagories.append(catagoryBtn);
    });
}

const activeClass = (id) => {
    const catagoryBtn = document.querySelectorAll('.catagoryBtn');
    btn = document.getElementById(`category-${id}`);
    catagoryBtn.forEach(btn => {
        btn.classList.remove('bg-[#15803D]', 'text-white');
    });
    btn.classList.add('bg-[#15803D]', 'text-white');
}
const displayPlants = (data) => {
    const plantsContainer = document.getElementById('tree-container');
    plantsContainer.innerHTML = "";
    data.forEach(plant => {
        const plantDiv = document.createElement('div');
        
        plantDiv.innerHTML = `
            <div class="border-rounded bg-white p-4 shadow h-auto rounded-lg ">
                <img src="${plant.image}" alt="" class="mb-2 h-44 w-full object-cover rounded-lg">
                <p onclick="modalDetails(${plant.id})" class="font-semibold text-[14px] text-[#1F2937] cursor-pointer hover:text-[#15803D]">${plant.name}</p>
                <p class="text-[12px] text-[#6B7280]">${plant.description}</p>
                <div class="flex justify-between items-center mt-3 mb-3">
                    <p class="text-[14px] text-[#15803D] px-2 py-1 rounded-xl bg-[#DCFCE7]">${plant.category}</p>
                    <p class="font-semibold text-[14px] text-[#1F2937]"><span>৳</span><span id="tree-price">${plant.price}</span></p>
                </div>
                <button onclick="addToCart(${plant.id})" id="add-cart-${plant.id}" class="btn btn-success w-full rounded-2xl bg-[#15803D] text-white text-[18px] text-medium hover:bg-[#15803D]/70">Add to Cart</button>
            </div>
        `
        plantsContainer.append(plantDiv);
    });
    manageSpinner(false);
}

const displayCatagoriesPlants = async (plant_categories) => {
    manageSpinner(true);
    let data = await getAllTress();
    data = data.filter(plant => plant.category === plant_categories);
    displayPlants(data);
}

const manageSpinner = (status) => {
    const spinner = document.getElementById('loading-spinner');
    const plantsContainer = document.getElementById('tree-container');
    if (status == true) {
        spinner.classList.remove('hidden');
        plantsContainer.classList.add('hidden');
    } else {
        spinner.classList.add('hidden');
        plantsContainer.classList.remove('hidden');
    }

}

let arr = [];
const addToCart = (id) => {
    const cartBtn = document.getElementById(`add-cart-${id}`);
   
    let itemExist = arr.find(item => item.id === id);
    if (itemExist) {
        itemExist.quantity += 1;
        displayAddedToCart();
        return;
    }

    data = {
        id: id,
        name: cartBtn.parentNode.children[1].innerText,
        price: cartBtn.parentNode.children[3].children[1].children[1].innerText,
        quantity: 1
    }
    arr.push(data);
    alert('Item added to cart');
    displayAddedToCart();
}

const displayAddedToCart = () => {
    const cartContainer = document.getElementById('cart-container');
    const cart = document.getElementById('cart');
    cartContainer.innerHTML = "";
    if(arr.length > 0){
        cart.children[2].classList.remove('hidden');
    }
    totalPriceDisplay = document.getElementById('total-price');
    totalPrice = 0;
    arr.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <div class="flex justify-between items-center  m-2 bg-[#F0FDF4] p-2">
                <div class="text-[#1F2937]">
                    <p class="text-[15px] font-semibold">${item.name}</p>
                    <p class="text-[12px]">৳${item.price} x ${item.quantity}</p>
                </div>
                <p class="text-2xl cursor-pointer" onclick="removeFromCart(${item.id})"><i class="bi bi-x"></i></p>
            </div>
        `
        totalPrice += item.price * item.quantity;
        cartContainer.append(cartItem);
    });
    totalPriceDisplay.innerText = totalPrice;
}

const removeFromCart = (id) => {
    arr = arr.filter(item => item.id !== id);
    displayAddedToCart();   
    if(arr.length === 0){
        const cart = document.getElementById('cart');
        cart.children[2].classList.add('hidden');
    }
}

const modalDetails = async (id) => {
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = "";

    let data = await getAllTress();
    let plant = data.find(item => item.id === id);

    if (plant) {
        modalContent.innerHTML = `
            <p class="text-2xl mb-3">${plant.name}</p>
            <img src="${plant.image}" alt="" class="mb-3 h-70 w-full object-cover rounded-lg">
            <p class="mb-2"><span class="font-bold">Category:</span> ${plant.category}</p>
            <p class="mb-2"><span class="font-bold">Price:</span> ${plant.price}</p>
            <p><span class="font-bold">Description:</span> ${plant.description}</p>
        `;
        document.getElementById('my_modal_5').showModal()
        allTree = document.getElementById('category-0');
        if(!allTree.classList.contains('bg-[#15803D]')){
            displayCatagoriesPlants(plant.category);
        }
    }
}
getAllTress();
getCatagories();


