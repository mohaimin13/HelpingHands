
document.addEventListener("DOMContentLoaded", function () {

    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginForm = document.getElementById("loginForm");

    const loginError = document.getElementById("loginError");

    const messageModal = document.getElementById("messageModal");
    const messageIcon = document.getElementById("messageIcon");
    const messageTitle = document.getElementById("messageTitle");
    const messageText = document.getElementById("messageText");
    const messageActions = document.getElementById("messageActions");
    const messageOkBtn = document.getElementById("messageOkBtn");

    const resetPasswordForm =
        document.getElementById("resetPasswordForm");

    const resetError = document.getElementById("resetError");

    let messageCallback = null;


    // Custom Message Box
    function showMessage(title, message, type, callback) {

        messageTitle.textContent = title;
        messageText.textContent = message;

        messageIcon.textContent = type === "success" ? "✓" : "!";

        messageCallback = callback || null;

        resetPasswordForm.style.display = "none";
        messageText.style.display = "block";

        messageActions.innerHTML = `
            <button type="button" id="messageOkBtn">
                OK
            </button>
        `;

        document.getElementById("messageOkBtn")
            .addEventListener("click", function () {

                messageModal.classList.remove("show");

                if (messageCallback) {
                    messageCallback();
                    messageCallback = null;
                }

            });

        messageModal.classList.add("show");
    }


    // Login Error Message
    function showLoginError(message) {

        loginError.textContent = message;
        loginError.style.display = "block";

    }


    
    function clearLoginError() {

        loginError.textContent = "";
        loginError.style.display = "none";

    }


   
    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "Hide";

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "Show";

        }

    });


  
    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        clearLoginError();

        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value;

        const rememberMe =
            document.getElementById("rememberMe").checked;


      
        if (!email || !password) {

            showLoginError("Please enter your email and password.");
            return;

        }


        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showLoginError("Please enter a valid email address.");
            return;

        }


       
        if (
            email.toLowerCase() === "admin@gmail.com" &&
            password === "Admin@123"
        ) {

            const currentUser = {
                name: "Admin",
                email: email,
                role: "admin"
            };

            if (rememberMe) {

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );

                sessionStorage.removeItem("currentUser");

            } else {

                sessionStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );

                localStorage.removeItem("currentUser");

            }

            showMessage(
                "Login Successful!",
                "Welcome Admin! You have successfully logged in.",
                "success",
                function () {
                    window.location.href = "dashboard.html";
                }
            );

            return;

        }


       
        const users = JSON.parse(
            localStorage.getItem("users")
        ) || [];


       
        const user = users.find(function (user) {

            return user.email.toLowerCase() === email.toLowerCase() &&
                   user.password === password;

        });


       
        if (user) {

            const currentUser = {
                name: user.name,
                email: user.email,
                role: user.role || "user"
            };


           
            if (rememberMe) {

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );

                sessionStorage.removeItem("currentUser");

            } else {

                sessionStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );

                localStorage.removeItem("currentUser");

            }


            showMessage(
                "Login Successful!",
                "Login successful! Welcome " + user.name,
                "success",
                function () {
                    window.location.href = "dashboard.html";
                }
            );

        } else {

            showLoginError("Invalid email or password");

        }

    });


    
    document.getElementById("email").addEventListener("input", function () {
        clearLoginError();
    });

    passwordInput.addEventListener("input", function () {
        clearLoginError();
    });


   
    const forgotPassword =
        document.getElementById("forgotPassword");

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();

        messageTitle.textContent = "Reset Password";
        messageText.textContent =
            "Enter your registered email and create a new password.";

        messageIcon.textContent = "🔒";

        messageText.style.display = "block";
        resetPasswordForm.style.display = "block";

        resetError.textContent = "";
        resetError.style.display = "none";

        document.getElementById("resetEmail").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmNewPassword").value = "";


        messageActions.innerHTML = `
            <button type="button" id="cancelResetBtn"
                style="background:#dddddd; color:#222222;">
                Cancel
            </button>

            <button type="button" id="resetPasswordBtn">
                Reset Password
            </button>
        `;


        messageModal.classList.add("show");


       
        document.getElementById("cancelResetBtn")
            .addEventListener("click", function () {

                messageModal.classList.remove("show");

            });


        
        document.getElementById("resetPasswordBtn")
            .addEventListener("click", function () {

                const email =
                    document.getElementById("resetEmail").value.trim();

                const newPassword =
                    document.getElementById("newPassword").value;

                const confirmPassword =
                    document.getElementById("confirmNewPassword").value;


               
                if (!email || !newPassword || !confirmPassword) {

                    resetError.textContent =
                        "Please fill in all fields.";

                    resetError.style.display = "block";
                    return;

                }


               
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(email)) {

                    resetError.textContent =
                        "Please enter a valid email address.";

                    resetError.style.display = "block";
                    return;

                }


                
                if (newPassword.length < 6) {

                    resetError.textContent =
                        "Password must be at least 6 characters!";

                    resetError.style.display = "block";
                    return;

                }


               
                if (newPassword !== confirmPassword) {

                    resetError.textContent =
                        "Passwords do not match!";

                    resetError.style.display = "block";
                    return;

                }


               
                let users = JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            
                const user = users.find(function (user) {

                    return user.email.toLowerCase() === email.toLowerCase();

                });


                if (!user) {

                    resetError.textContent = "Email not found!";
                    resetError.style.display = "block";
                    return;

                }


               
                user.password = newPassword;

                localStorage.setItem(
                    "users",
                    JSON.stringify(users)
                );


                
                messageModal.classList.remove("show");

                showMessage(
                    "Password Reset Successful!",
                    "Your password has been updated. You can now login.",
                    "success"
                );

            });

    });


   
    messageModal.addEventListener("click", function (event) {

        if (event.target === messageModal) {

            messageModal.classList.remove("show");

        }

    });

});
