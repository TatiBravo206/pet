// --- VARIABLES GLOBALES Y DATA ---

const productsData = {
    comida: [
        { id: 1, name: "Alimento Seco Premium (15kg)", price: 850 },
        { id: 2, name: "Latas de Comida Húmeda", price: 90 },
        { id: 3, name: "Snacks Dentales para Perro", price: 120 },
        { id: 10, name: "Leche Maternizada para Cachorros", price: 300 }
    ],
    higiene: [
        { id: 4, name: "Champú Antipulgas", price: 250 },
        { id: 5, name: "Pipetas Desparasitantes", price: 400 },
        { id: 6, name: "Cepillo para el Pelaje", price: 180 },
        { id: 11, name: "Cortaúñas para Gato", price: 150 }
    ],
    accesorios: [
        { id: 7, name: "Correa Retráctil 5m", price: 350 },
        { id: 8, name: "Plato de Cerámica Antivuelco", price: 150 },
        { id: 9, name: "Pelota de Goma Resistente", price: 100 },
        { id: 12, name: "Cama Suave para Mascotas", price: 700 }
    ]
};

let cart = [];
let userEmail = "";
let petName = "";
let lastSection = "store-section"; 
let lastDynamicView = null; 

// Datos de la Mascota y Vacunación (persisten mientras la app esté abierta)
let petData = {
    ownerName: "Dueño",
    ownerEmail: null, 
    petName: "Mi Mascota", 
    petType: "N/A",
    petAge: 0,
    lastVacDate: null, 
    lastVacType: "N/A"
};


// Elementos DOM
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section"); 
const storeSection = document.getElementById("store-section");
const cartSection = document.getElementById("cart-section");
const ticketSection = document.getElementById("ticket-section");
const configSection = document.getElementById("config-section"); 
const navConfigUtil = document.getElementById("nav-configuracion-util"); 
const userInfoSpan = document.getElementById("user-info");
const loginBtnHeader = document.getElementById("login-btn-header");
const logoutBtn = document.getElementById("logout-btn");
const dynamicContentArea = document.getElementById("dynamic-content-area"); 
const appointmentSection = document.getElementById("appointment-section");
const productContentArea = document.getElementById("product-content-area");
const reminderSection = document.getElementById("reminder-section"); 
const appointmentMessage = document.getElementById("appointment-message");
const scheduleReminderBtn = document.getElementById("schedule-reminder-btn");


// --- FUNCIONES DE UTILIDAD Y VISTAS ---

function initView(currentSection) {
    // Oculta todas las secciones principales
    [loginSection, registerSection, storeSection, cartSection, ticketSection, configSection].forEach(sec => {
        sec.style.display = sec.id === currentSection ? "block" : "none";
    });

    // Lógica específica para la tienda (ocultar subsecciones al ir a inicio/otra sección principal)
    if (currentSection === "store-section") {
        // Solo la store-section maneja sub-vistas dinámicas.
        if (!lastDynamicView || lastDynamicView === 'inicio') {
            document.getElementById("main-welcome-banner").style.display = 'flex'; 
            dynamicContentArea.style.display = 'none'; 
        } else {
             document.getElementById("main-welcome-banner").style.display = 'none'; 
             dynamicContentArea.style.display = 'block'; 
        }

        appointmentMessage.style.display = "none";
        appointmentSection.style.display = lastDynamicView === 'citas' ? 'block' : 'none';
        productContentArea.style.display = lastDynamicView === 'productos' ? 'block' : 'none';
        reminderSection.style.display = lastDynamicView === 'recordatorio' ? 'block' : 'none';
        
    }
    
    // Si el usuario está logueado, mostrar el carrito y el enlace de Configuración
    if(userEmail) {
        document.getElementById("cart-icon").style.display = "inline";
        navConfigUtil.style.display = "inline"; // Mostrar Conf.
        // Si estamos en configuración, cargar los datos
        if (currentSection === "config-section") {
            loadConfigData();
        }
    } else {
         navConfigUtil.style.display = "none";
    }
}

// Lógica para mostrar la sección de Citas, Productos o Recordatorio
function showDynamicContent(sectionToShow) {
    // Mostrar/Ocultar el área dinámica
    if (sectionToShow !== 'inicio') { 
        dynamicContentArea.style.display = 'block';
        document.getElementById("main-welcome-banner").style.display = 'none';
    } else {
        dynamicContentArea.style.display = 'none';
        document.getElementById("main-welcome-banner").style.display = 'flex';
    }

    // Ocultar/Mostrar secciones internas
    appointmentSection.style.display = sectionToShow === 'citas' ? 'block' : 'none';
    productContentArea.style.display = sectionToShow === 'productos' ? 'block' : 'none';
    reminderSection.style.display = sectionToShow === 'recordatorio' ? 'block' : 'none';

    lastDynamicView = sectionToShow; 

    if (sectionToShow === 'productos') {
        loadCategory("comida");
    }
    
    if (sectionToShow === 'recordatorio') {
        updateReminderSection();
    }
}

// --- LÓGICA DE AUTENTICACIÓN (LOGIN/REGISTER) ---

// Login
document.getElementById("login-btn").addEventListener("click", () => {
    const emailInput = document.getElementById("email-input").value.trim();
    const passwordInput = document.getElementById("password-input").value.trim();

    if (!emailInput || !passwordInput) {
        alert("Por favor, completa Correo y Contraseña.");
        return;
    }
    
    // Si el usuario ya se registró (simulado)
    if (emailInput === petData.ownerEmail) {
        userEmail = petData.ownerEmail;
        petName = petData.petName;
    } else {
        // Login default si no hay registro previo
        userEmail = emailInput;
        petData.ownerName = "Usuario PetTech";
        petName = "Mi Mascota"; 
        petData.ownerEmail = emailInput; // Simular que se registró con el login
    }

    // Actualizar interfaz de sesión
    userInfoSpan.textContent = `Hola, ${petName}`;
    loginBtnHeader.style.display = "none"; 
    userInfoSpan.style.display = "inline";
    logoutBtn.style.display = "inline";
    navConfigUtil.style.display = "inline"; // Mostrar Conf.

    initView("store-section"); 
    
    if (lastDynamicView) {
        showDynamicContent(lastDynamicView);
    }
    
    lastSection = "store-section"; 
});

// Logout
logoutBtn.addEventListener("click", () => {
    cart = [];
    userEmail = "";
    petName = "";
    lastDynamicView = null; 
    updateCart(); 
    initView("login-section");
    
    loginBtnHeader.style.display = "inline"; 
    userInfoSpan.style.display = "none";
    document.getElementById("cart-icon").style.display = "none";
    logoutBtn.style.display = "none";
    navConfigUtil.style.display = "none"; // Ocultar Conf.
    
    document.getElementById("email-input").value = "";
    document.getElementById("password-input").value = "";
});

// Registro
document.getElementById("register-btn").addEventListener("click", () => {
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-password").value.trim();
    const pName = document.getElementById("reg-pet-name").value.trim();
    const pType = document.getElementById("reg-pet-type").value.trim();

    if (!name || !email || !pass || !pName || !pType) {
        alert("Por favor, completa todos los campos básicos del registro.");
        return;
    }
    
    // Guardar datos en la variable global (simulando base de datos)
    userEmail = email;
    petName = pName;
    petData = {
        ...petData, 
        ownerName: name,
        ownerEmail: email,
        petName: pName,
        petType: pType,
    };

    // Auto-login y redirigir a Configuración para completar datos
    userInfoSpan.textContent = `Hola, ${petName}`;
    loginBtnHeader.style.display = "none"; 
    userInfoSpan.style.display = "inline";
    document.getElementById("cart-icon").style.display = "inline";
    logoutBtn.style.display = "inline";
    navConfigUtil.style.display = "inline"; // Mostrar Conf.
    
    alert(`Registro básico exitoso. ¡Bienvenido, ${name}! Completa los datos de tu mascota en Configuración.`);
    initView("config-section"); 
});


// --- LÓGICA DE CONFIGURACIÓN ---

function loadConfigData() {
    document.getElementById("config-login-msg").style.display = userEmail ? "none" : "block";
    
    if (userEmail) {
        // Cargar datos guardados
        document.getElementById("config-name").value = petData.ownerName || '';
        document.getElementById("config-email").value = petData.ownerEmail || userEmail;
        document.getElementById("config-pet-name").value = petData.petName || '';
        document.getElementById("config-pet-type").value = petData.petType || '';
        document.getElementById("config-pet-age").value = petData.petAge > 0 ? petData.petAge : '';
        document.getElementById("config-pet-vacuna-tipo").value = petData.lastVacType !== 'N/A' ? petData.lastVacType : '';
        document.getElementById("config-pet-vacuna-fecha").value = petData.lastVacDate ? petData.lastVacDate.toISOString().split('T')[0] : '';
        document.getElementById("config-message").style.display = 'none';
    }
}

document.getElementById("save-config-btn").addEventListener('click', () => {
    if (!userEmail) {
        alert("Debes iniciar sesión para guardar la configuración.");
        return;
    }

    const name = document.getElementById("config-name").value.trim();
    const pName = document.getElementById("config-pet-name").value.trim();
    const pType = document.getElementById("config-pet-type").value.trim();
    const pAge = parseInt(document.getElementById("config-pet-age").value.trim());
    const vacType = document.getElementById("config-pet-vacuna-tipo").value.trim();
    const vacDateStr = document.getElementById("config-pet-vacuna-fecha").value;

    if (!name || !pName || !pType || isNaN(pAge) || pAge < 0) {
        alert("Por favor, completa los campos de Nombre del Dueño, Nombre, Tipo y Edad de la Mascota.");
        return;
    }
    
    // Conversión de fecha
    const vacDate = vacDateStr ? new Date(vacDateStr + 'T00:00:00') : null;

    // **GUARDAR DATOS (PERSISTENCIA SIMULADA) **
    petData.ownerName = name;
    petData.petName = pName;
    petData.petType = pType;
    petData.petAge = pAge;
    petData.lastVacType = vacType || "N/A";
    petData.lastVacDate = vacDate;
    petName = pName; // Asegurar que el nombre en el header esté actualizado

    // Actualizar Header
    userInfoSpan.textContent = `Hola, ${petName}`;
    
    document.getElementById("config-message").textContent = "¡Cambios guardados con éxito!";
    document.getElementById("config-message").style.display = 'block';
    
    // Si se actualizan datos de vacuna, actualizar la vista de recordatorio
    if (lastDynamicView === 'recordatorio') {
        updateReminderSection();
    }
});


// --- LÓGICA DE PRODUCTOS Y CARRITO ---

function loadCategory(category) {
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";
    const products = productsData[category];
    
    products.forEach(prod => {
        const prodDiv = document.createElement("div");
        prodDiv.className = "product";
        prodDiv.innerHTML = `
            <h4>${prod.name}</h4>
            <p>$${prod.price}</p>
            <button class="add-to-cart-btn" data-id="${prod.id}" data-category="${category}">Agregar al carrito</button>
        `;
        productsDiv.appendChild(prodDiv);
    });

    productsDiv.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            addToCart(parseInt(btn.dataset.id), btn.dataset.category);
        });
    });
}

function addToCart(id, category) {
    let product = productsData[category].find(p => p.id === id);
    if (!product) {
        for (const cat in productsData) {
            const found = productsData[cat].find(p => p.id === id);
            if (found) {
                product = found;
                category = cat;
                break;
            }
        }
    }
    if (!product) return;
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        const realCategory = category;
        cart.push({ ...product, category: realCategory, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItemsTbody = document.getElementById("cart-items");
    const cartTotalSpan = document.getElementById("cart-total");
    const cartCountSpan = document.getElementById("cart-count");
    
    cartItemsTbody.innerHTML = "";
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #777;">El carrito está vacío.</td></tr>';
        cartCountSpan.textContent = 0;
        cartTotalSpan.textContent = 0;
        return;
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        const tr = document.createElement("tr");
        const categoryDisplay = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${categoryDisplay}</td>
            <td style="text-align: right;">$${item.price}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: center;"><button data-id="${item.id}" style="background: #e74c3c;">Eliminar</button></td>
        `;
        cartItemsTbody.appendChild(tr);
    });

    cartTotalSpan.textContent = total;
    cartCountSpan.textContent = cart.length; 
    
    cartItemsTbody.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            cart = cart.filter(item => item.id !== parseInt(btn.dataset.id));
            updateCart();
        });
    });
}

document.getElementById("buy-button").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("El carrito está vacío. Agrega productos primero.");
        return;
    }
    if (!userEmail) {
        alert("Debes iniciar sesión para finalizar la compra.");
        return;
    }

    let ticketHTML = `<p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>`;
    ticketHTML += `<p><strong>Cliente:</strong> ${petData.ownerName} (${userEmail})</p>`;
    ticketHTML += `<p><strong>Mascota:</strong> ${petName}</p>`;
    const ticketContent = document.getElementById("ticket-content");
    let total = 0;
    let summary = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        return `<tr><td>${item.name}</td><td style="text-align: center;">${item.quantity}</td><td style="text-align: right;">$${subtotal}</td></tr>`;
    }).join('');

    ticketContent.innerHTML = ticketHTML + 
        `<table style="width: 100%; margin-top: 10px;"><thead><tr style="background-color: #f0f0f0;"><th>Producto</th><th>Cant.</th><th>Subtotal</th></tr></thead><tbody>${summary}</tbody></table>` +
        `<hr style="border-top: 2px solid #5b0d87;">` +
        `<h3 style="text-align: right; color: #5b0d87;">Total Final: $${total}</h3>`;
        
    initView("ticket-section");
});

document.getElementById("close-ticket-btn").addEventListener("click", () => {
    cart = [];
    updateCart();
    initView("store-section");
});


// --- LÓGICA DE AGENDAR CITA ---
document.getElementById("schedule-btn").addEventListener('click', () => {
    
    if (!userEmail) {
        appointmentMessage.textContent = "❌ No se pudo. Por favor, iniciar sesión primero.";
        appointmentMessage.style.color = "#e74c3c"; 
        appointmentMessage.style.display = "block";
        return;
    }

    const date = document.getElementById("appointment-date").value;
    const time = document.getElementById("appointment-time").value;
    const reason = document.getElementById("appointment-reason").value;

    if (!date || !time || !reason) {
        appointmentMessage.textContent = "Por favor, completa todos los campos de la cita.";
        appointmentMessage.style.color = "#e74c3c";
        appointmentMessage.style.display = "block";
        return;
    }
    
    // Nueva lógica de redirección para Cita (simulando la conexión)
    const startDateTime = `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00`;
    const endDateTime = new Date(date + 'T' + time);
    endDateTime.setHours(endDateTime.getHours() + 1); // Cita de 1 hora
    const endTimeStr = endDateTime.toTimeString().split(' ')[0].replace(/:/g, '').substring(0, 4) + '00';
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cita%20Veterinaria%20para%20${encodeURIComponent(petData.petName)}%3A%20${encodeURIComponent(reason)}&dates=${startDateTime}/${date.replace(/-/g, '')}T${endTimeStr}&details=Motivo%3A%20${encodeURIComponent(reason)}.%20Cl%C3%ADnica%20PetTech.&sf=true&output=xml`;
    
    window.open(calendarUrl, '_blank');
    
    appointmentMessage.textContent = `✅ Cita agendada para el ${date} a las ${time} por "${reason}". Se abrió una nueva pestaña para guardar en tu calendario.`;
    appointmentMessage.style.color = "#5b0d87"; 
    appointmentMessage.style.display = "block";

    document.getElementById("appointment-date").value = '';
    document.getElementById("appointment-time").value = '';
    document.getElementById("appointment-reason").value = '';
});


// --- LÓGICA DE RECORDATORIOS ---

function updateReminderSection() {
    const reminderLoginMsg = document.getElementById("reminder-login-msg");
    const reminderBodyElements = document.getElementById("reminder-body").querySelectorAll('.reminder-box, h3, #reminder-status');
    
    if (!userEmail) {
        reminderLoginMsg.style.display = "block";
        reminderBodyElements.forEach(el => el.style.display = 'none');
        scheduleReminderBtn.style.display = 'none';
        return;
    }
    
    reminderLoginMsg.style.display = "none";
    reminderBodyElements.forEach(el => el.style.display = 'block');
    
    document.getElementById("pet-name-reminder").textContent = petName;
    document.getElementById("last-vac-type").textContent = petData.lastVacType || "N/A";
    
    let lastDateStr = petData.lastVacDate ? petData.lastVacDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A";
    document.getElementById("last-vac-date").textContent = lastDateStr;

    if (petData.lastVacDate && petData.lastVacType !== 'N/A') {
        const nextVacDate = new Date(petData.lastVacDate);
        nextVacDate.setMonth(nextVacDate.getMonth() + 2); // Sumar 2 meses
        
        const nextDateStr = nextVacDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        
        document.getElementById("next-vac-date").textContent = nextDateStr;
        document.getElementById("reminder-status").textContent = `Tu recordatorio para la próxima dosis de ${petData.lastVacType} ha sido calculado.`;
        document.getElementById("next-reminder-info").style.borderColor = '#e74c3c'; 
        
        // Mostrar el botón de recordatorio si hay datos válidos
        scheduleReminderBtn.style.display = 'block'; 

    } else {
        document.getElementById("next-vac-date").textContent = "Faltan datos de vacunación.";
        document.getElementById("reminder-status").textContent = `Por favor, completa los datos de la última vacuna de ${petName} en la sección de Configuración.`;
        document.getElementById("next-reminder-info").style.borderColor = '#7f8c8d'; 
        scheduleReminderBtn.style.display = 'none'; 
    }
}

// Evento para el botón de Agendar Recordatorio
scheduleReminderBtn.addEventListener('click', () => {
    if (!petData.lastVacDate || !petData.lastVacType || !userEmail) {
        alert("Primero debes iniciar sesión y guardar la fecha/tipo de última vacuna en Configuración.");
        return;
    }
    
    const nextVacDate = new Date(petData.lastVacDate);
    nextVacDate.setMonth(nextVacDate.getMonth() + 2); 
    const dateStr = nextVacDate.toISOString().split('T')[0];
    const timeStr = "10:00:00"; // Hora predeterminada

    // --- NUEVA LÓGICA: CONSTRUCCIÓN Y REDIRECCIÓN DEL ENLACE ---
    const startDateTime = `${dateStr.replace(/-/g, '')}T100000`;
    const endDateTime = `${dateStr.replace(/-/g, '')}T110000`; // Evento de 1 hora (10:00 a 11:00)

    const title = `VACUNA PENDIENTE para ${petData.petName} (${petData.lastVacType})`;
    const description = `Es hora de la próxima vacuna (${petData.lastVacType}). Por favor, agenda una cita en PetTech.`;

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&sf=true&output=xml`;
    
    // Abrir el enlace en una nueva pestaña (esto simula la conexión y evita problemas de permisos)
    window.open(calendarUrl, '_blank');
    
    alert(`Se ha abierto una nueva pestaña para guardar el recordatorio de vacunación en tu calendario.`);
});


// --- EVENTOS DE NAVEGACIÓN ---
document.getElementById("nav-inicio").addEventListener('click', (e) => { 
    e.preventDefault(); 
    lastSection = "store-section";
    lastDynamicView = 'inicio'; 
    initView("store-section"); 
    showDynamicContent('inicio'); 
});
document.getElementById("nav-citas").addEventListener('click', (e) => { 
    e.preventDefault(); 
    lastSection = "store-section";
    initView("store-section"); 
    showDynamicContent('citas'); 
});
document.getElementById("nav-productos").addEventListener('click', (e) => { 
    e.preventDefault(); 
    lastSection = "store-section";
    initView("store-section"); 
    showDynamicContent('productos'); 
});
document.getElementById("nav-recordatorio").addEventListener('click', (e) => { 
    e.preventDefault(); 
    lastSection = "store-section";
    initView("store-section"); 
    showDynamicContent('recordatorio'); 
});
document.getElementById("nav-configuracion-util").addEventListener('click', (e) => { 
    e.preventDefault(); 
    lastSection = "config-section";
    initView("config-section"); 
});
document.getElementById("view-categories-btn").addEventListener('click', () => { 
    initView("store-section"); 
    showDynamicContent('productos'); 
});

// Eventos de Formulario (Login/Register)
document.getElementById("show-register-btn").addEventListener("click", (e) => {
    e.preventDefault();
    initView("register-section");
});
document.getElementById("show-login-btn").addEventListener("click", (e) => {
    e.preventDefault();
    initView("login-section");
});

// Evento de Iniciar Sesión en el Header
document.getElementById("login-btn-header").addEventListener('click', () => { 
    // Guarda la vista dinámica actual antes de ir al login
    if (storeSection.style.display === "block" && dynamicContentArea.style.display === 'block') {
        if (appointmentSection.style.display === 'block') lastDynamicView = 'citas';
        else if (productContentArea.style.display === 'block') lastDynamicView = 'productos';
        else if (reminderSection.style.display === 'block') lastDynamicView = 'recordatorio';
    } else {
        lastDynamicView = 'inicio';
    }
    
    initView("login-section"); 
});


// Evento para mostrar/ocultar carrito desde el ícono del header
document.getElementById("cart-icon").addEventListener('click', () => {
    if (cart.length > 0) {
        if (cartSection.style.display === "block") {
            // Volver a la última vista de la tienda
            initView("store-section");
            showDynamicContent(lastDynamicView || 'inicio');
        } else {
            initView("cart-section");
        }
    } else {
        alert("El carrito está vacío.");
    }
});


// Eventos para botones de categorías (Comida, Higiene, Accesorios)
document.querySelectorAll('#categories button').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        loadCategory(category);
    });
});


// INICIALIZACIÓN
updateCart(); 
initView("store-section");
showDynamicContent('inicio'); // Empezar en la vista de inicio con el banner
