// Módulo de Estilos
const AuthModalStyles = (() => {
    function injectDarkModeCSS() {
        return;
    }

    return { injectDarkModeCSS };
})();

// Módulo de Validaciones
const AuthValidation = (() => {
    const MIN_NAME_LENGTH = 2;
    const MAX_NAME_LENGTH = 50;
    const MIN_PASSWORD_LENGTH = 8;
    const MAX_PASSWORD_LENGTH = 128;
    const MAX_EMAIL_LENGTH = 254;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateName(name) {
        if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
            return `Nombre debe tener entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} caracteres`;
        }
        return null;
    }

    function validateEmail(email) {
        if (email.length > MAX_EMAIL_LENGTH) {
            return `Correo muy largo (máximo ${MAX_EMAIL_LENGTH} caracteres)`;
        }
        if (!EMAIL_REGEX.test(email)) {
            return "Correo inválido";
        }
        return null;
    }

    function validatePassword(password) {
        if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
            return `Contraseña debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres`;
        }
        return null;
    }

    function validatePasswordMatch(password, confirmPassword) {
        if (password !== confirmPassword) {
            return "Las contraseñas no coinciden";
        }
        return null;
    }

    return {
        validateName,
        validateEmail,
        validatePassword,
        validatePasswordMatch
    };
})();

// Módulo de API
const AuthAPI = (() => {
    const BASE_URL = "http://localhost:3000/api/users";

    async function register(userData) {
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        return response.json();
    }

    async function login(credentials) {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        return {
            ok: response.ok,
            data: await response.json()
        };
    }

    return { register, login };
})();

// Módulo de Almacenamiento
const AuthStorage = (() => {
    function saveToken(token) {
        localStorage.setItem("token", token);
    }

    function saveLoginState(email, userName) {
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", userName || "Usuario");
    }

    function clearLoginState() {
        localStorage.removeItem("isLogged");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("rutina");
    }

    function getLoginState() {
        return {
            isLogged: localStorage.getItem("isLogged") === "true",
            email: localStorage.getItem("userEmail"),
            userName: localStorage.getItem("userName"),
            token: localStorage.getItem("token"),
        };
    }

    return {
        saveToken,
        saveLoginState,
        clearLoginState,
        getLoginState
    };
})();

// Módulo de Modales
const AuthModals = (() => {
    function getModalsHTML() {
        return `
        <!-- Modal Inicio de Sesión -->
        <div class="modal fade modal-dark" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
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
                                    <span class="input-group-text"><i class="fa-solid fa-user" aria-hidden="true"></i></span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="password" name="password" placeholder="Ingresa tu contraseña" required />
                                    <span class="input-group-text"><i class="fa-solid fa-key" aria-hidden="true"></i></span>
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
        <div class="modal fade modal-dark" id="registroModal" tabindex="-1" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
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
        <div class="modal fade modal-dark" id="perfilModal" tabindex="-1" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
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
    }

    function injectModals() {
        if (document.getElementById("loginModal")) return;
        document.body.insertAdjacentHTML("afterbegin", getModalsHTML());
    }

    function hideModal(modalId) {
        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
        if (modal) modal.hide();
    }

    function showModal(modalId) {
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
    }

    return {
        injectModals,
        hideModal,
        showModal
    };
})();

// Módulo de Autenticación
const AuthHandler = (() => {
    async function handleRegister(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const contraseña = document.getElementById("contraseña").value;
        const confContraseña = document.getElementById("confContraseña").value;

        let error = AuthValidation.validateName(nombre);
        if (error) {
            showToast(error, "error");
            return;
        }

        error = AuthValidation.validateName(apellido);
        if (error) {
            showToast("Apellido " + error.toLowerCase(), "error");
            return;
        }

        error = AuthValidation.validateEmail(correo);
        if (error) {
            showToast(error, "error");
            return;
        }

        error = AuthValidation.validatePassword(contraseña);
        if (error) {
            showToast(error, "error");
            return;
        }

        error = AuthValidation.validatePasswordMatch(contraseña, confContraseña);
        if (error) {
            showToast(error, "error");
            return;
        }

        const userData = { Name: nombre, Email: correo, Password: contraseña };

        try {
            const data = await AuthAPI.register(userData);
            if (data.message && data.message.includes("éxito")) {
                document.getElementById("registerForm").reset();
                showToast("Usuario registrado con éxito", "success");
                AuthModals.hideModal("registroModal");
                setTimeout(() => {
                    AuthModals.showModal("loginModal");
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

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        let error = AuthValidation.validateEmail(email);
        if (error) {
            showToast(error, "error");
            return;
        }

        error = AuthValidation.validatePassword(password);
        if (error) {
            showToast(error, "error");
            return;
        }

        try {
            const { ok, data } = await AuthAPI.login({ Email: email, Password: password });

            if (ok) {
                AuthStorage.saveToken(data.token);
                AuthStorage.saveLoginState(email, data.userName);
                showToast("Inicio de sesión exitoso", "success");
                UIManager.updateUI();
                AuthModals.hideModal("loginModal");

                if (typeof onLoginSuccess === 'function') {
                    onLoginSuccess();
                }

                if (typeof routineToSave !== 'undefined' && routineToSave) {
                    setTimeout(() => {
                        saveRoutineToDatabase(routineToSave);
                    }, 500);
                } else {
                    setTimeout(() => {
                        if (window.location.pathname !== '/rutina') {
                            window.location.href = "/rutina";
                        }
                    }, 1000);
                }
            } else {
                showToast(`Error: ${data.message}`, "error");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            showToast("Hubo un problema al iniciar sesión", "error");
        }
    }

    return {
        handleRegister,
        handleLogin
    };
})();

// Módulo de UI
const UIManager = (() => {
    function attachFormListeners() {
        const registerForm = document.getElementById("registerForm");
        const loginForm = document.getElementById("loginForm");

        if (registerForm) {
            registerForm.removeEventListener("submit", AuthHandler.handleRegister);
            registerForm.addEventListener("submit", AuthHandler.handleRegister);
        }

        if (loginForm) {
            loginForm.removeEventListener("submit", AuthHandler.handleLogin);
            loginForm.addEventListener("submit", AuthHandler.handleLogin);
        }
    }

    function createAuthButtons() {
        const state = AuthStorage.getLoginState();
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

        if (state.isLogged) {
            const profileBtn = document.createElement("button");
            profileBtn.className = "btn btn-outline-light";
            profileBtn.setAttribute("data-bs-toggle", "modal");
            profileBtn.setAttribute("data-bs-target", "#perfilModal");
            profileBtn.innerHTML = '<i class="fa-solid fa-user" aria-hidden="true"></i><span class="visually-hidden">Perfil</span>';
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
        const state = AuthStorage.getLoginState();
        const exercisesLinks = document.querySelectorAll(".nav-exercises");
        const calendarLinks = document.querySelectorAll(".nav-calendar");
        const routinesLinks = document.querySelectorAll(".nav-my-routines");

        [exercisesLinks, calendarLinks, routinesLinks].forEach(links => {
            links.forEach(link => {
                link.classList.toggle("is-hidden", !state.isLogged);
            });
        });
    }

    function updateUI() {
        createAuthButtons();
        updateNavLinks();
    }

    function loadUserProfile() {
        const state = AuthStorage.getLoginState();
        document.getElementById("perfilNombre").textContent = state.userName;
        document.getElementById("perfilCorreo").textContent = state.email || "No disponible";

        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.onclick = function () {
            AuthStorage.clearLoginState();
            window.location.href = "/";
        };
    }

    return {
        attachFormListeners,
        createAuthButtons,
        updateNavLinks,
        loadUserProfile,
        updateUI
    };
})();

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
    AuthModalStyles.injectDarkModeCSS();
    AuthModals.injectModals();
    UIManager.attachFormListeners();
    UIManager.updateUI();
});

// Sincronización de storage
window.addEventListener("storage", function (e) {
    if (e.key === "isLogged") {
        UIManager.updateUI();
    }
});
