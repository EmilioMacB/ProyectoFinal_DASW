document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("loginModal")) {
        const modalsHTML = `
        <!-- Modal Inicio de Sesión -->
        <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitleId">Iniciar Sesión</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm">
                            <div class="mb-3">
                                <label for="email" class="form-label">Correo</label>
                                <div class="input-group">
                                    <input type="email" class="form-control" id="email" name="email" placeholder="Ingresa tu correo" required />
                                    <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="password" name="password" placeholder="Ingresa tu contraseña" required />
                                    <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button type="submit" form="loginForm" class="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <div>¿No tienes cuenta? <a href="#" data-bs-toggle="modal" data-bs-target="#registroModal">Regístrate aquí</a></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Registro de Usuarios -->
        <div class="modal fade" id="registroModal" tabindex="-1" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitleId">Registrarse</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="registerForm">
                            <div class="container-fluid">
                                <div class="mb-3">
                                    <input type="text" class="form-control" id="nombre" name="nombre" placeholder="Nombre(s)" required>
                                </div>
                                <div class="mb-3">
                                    <input type="text" class="form-control" id="apellido" name="apellido" placeholder="Apellidos" required>
                                </div>
                                <div class="mb-3">
                                    <input type="email" class="form-control" id="correo" name="correo" placeholder="Tu correo" required>
                                </div>
                                <div class="mb-3">
                                    <input type="password" class="form-control" id="contraseña" name="contraseña" placeholder="Contraseña" required>
                                </div>
                                <div class="mb-3">
                                    <input type="password" class="form-control" id="confContraseña" name="confContraseña" placeholder="Confirmar Contraseña" required>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button type="submit" class="btn btn-success">Registrarse</button>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <div>¿Ya tienes una cuenta? <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal" data-bs-dismiss="modal">Inicia sesión</a></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Perfil de Usuario -->
        <div class="modal fade" id="perfilModal" tabindex="-1" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitleId">Mi Perfil</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Nombre</label>
                            <p id="perfilNombre" class="form-control-plaintext"></p>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Correo</label>
                            <p id="perfilCorreo" class="form-control-plaintext"></p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" id="logoutBtn">Cerrar Sesión</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML("afterbegin", modalsHTML);
        attachFormListeners();
    }

    createAuthButtons();
    updateNavLinks();
});

function attachFormListeners() {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.removeEventListener("submit", handleRegister);
        registerForm.addEventListener("submit", handleRegister);
    }

    if (loginForm) {
        loginForm.removeEventListener("submit", handleLogin);
        loginForm.addEventListener("submit", handleLogin);
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;
    const confContraseña = document.getElementById("confContraseña").value;

    if (contraseña !== confContraseña) {
        showToast("Las contraseñas no coinciden", "error");
        return;
    }

    const usuario = { Name: nombre, Email: correo, Password: contraseña };

    try {
        const response = await fetch("http://localhost:3000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
        });

        const data = await response.json();
        if (response.ok) {
            this.reset();
            showToast("Usuario registrado con éxito", "success");
            const registroModal = bootstrap.Modal.getInstance(document.getElementById('registroModal'));
            if (registroModal) registroModal.hide();
            setTimeout(() => {
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            }, 500);
        } else {
            showToast(`Error: ${data.message}`, "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showToast("Hubo un error al registrar el usuario", "error");
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: email, Password: password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("isLogged", "true");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", data.userName || "Usuario");
            showToast("Inicio de sesión exitoso", "success");
            createAuthButtons();
            updateNavLinks();
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) loginModal.hide();
            setTimeout(() => {
                window.location.href = "/rutina";
            }, 1000);
        } else {
            showToast(`Error: ${data.message}`, "error");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        showToast("Hubo un problema al iniciar sesión", "error");
    }
}

function createAuthButtons() {
    const isLogged = localStorage.getItem("isLogged") === "true";
    const navbar = document.querySelector(".navbar-collapse");
    if (!navbar) return;

    let authContainer = navbar.querySelector("#authButtonsContainer");
    if (!authContainer) {
        authContainer = document.createElement("div");
        authContainer.id = "authButtonsContainer";
        authContainer.className = "d-flex gap-2 ms-auto";
        navbar.appendChild(authContainer);
    }

    authContainer.innerHTML = "";

    if (isLogged) {
        const profileBtn = document.createElement("button");
        profileBtn.className = "btn btn-outline-light";
        profileBtn.setAttribute("data-bs-toggle", "modal");
        profileBtn.setAttribute("data-bs-target", "#perfilModal");
        profileBtn.innerHTML = '<i class="fa-solid fa-user"></i>';
        profileBtn.addEventListener("click", loadUserProfile);

        authContainer.appendChild(profileBtn);
    } else {
        const loginBtn = document.createElement("a");
        loginBtn.href = "#";
        loginBtn.className = "btn btn-outline-light";
        loginBtn.setAttribute("data-bs-toggle", "modal");
        loginBtn.setAttribute("data-bs-target", "#loginModal");
        loginBtn.textContent = "Login";

        const registerBtn = document.createElement("a");
        registerBtn.href = "#";
        registerBtn.className = "btn btn-light";
        registerBtn.setAttribute("data-bs-toggle", "modal");
        registerBtn.setAttribute("data-bs-target", "#registroModal");
        registerBtn.textContent = "Registrarse";

        authContainer.appendChild(loginBtn);
        authContainer.appendChild(registerBtn);
    }
}

function updateNavLinks() {
    const isLogged = localStorage.getItem("isLogged") === "true";
    const exercisesLinks = document.querySelectorAll(".nav-exercises");
    const calendarLinks = document.querySelectorAll(".nav-calendar");
    const routinesLinks = document.querySelectorAll(".nav-my-routines");

    exercisesLinks.forEach(link => {
        link.style.display = isLogged ? "block" : "none";
    });

    calendarLinks.forEach(link => {
        link.style.display = isLogged ? "block" : "none";
    });

    routinesLinks.forEach(link => {
        link.style.display = isLogged ? "block" : "none";
    });
}

function loadUserProfile() {
    const email = localStorage.getItem("userEmail") || "No disponible";
    const name = localStorage.getItem("userName") || "Usuario";

    document.getElementById("perfilNombre").textContent = name;
    document.getElementById("perfilCorreo").textContent = email;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.onclick = function () {
        localStorage.removeItem("isLogged");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("rutina");
        window.location.href = "/";
    };
}

window.addEventListener("storage", function (e) {
    if (e.key === "isLogged") {
        createAuthButtons();
        updateNavLinks();
    }
});
