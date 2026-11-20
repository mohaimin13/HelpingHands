
document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    const messageModal = document.getElementById("messageModal");
    const messageIcon = document.getElementById("messageIcon");
    const messageTitle = document.getElementById("messageTitle");
    const messageText = document.getElementById("messageText");
    const messageOkBtn = document.getElementById("messageOkBtn");


    // Custom Message Box
    function showMessage(title, message, type, callback) {

        messageTitle.textContent = title;
        messageText.textContent = message;

        messageIcon.textContent = type === "success" ? "✓" : "!";

        messageModal.classList.add("show");

        messageOkBtn.onclick = function () {

            messageModal.classList.remove("show");

            if (callback) {
                callback();
            }

        };

    }


    // Password Show / Hide
    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "Show";
        }

    });


    // Confirm Password Show / Hide
    toggleConfirmPassword.addEventListener("click", function () {

        if (confirmPasswordInput.type === "password") {
            confirmPasswordInput.type = "text";
            toggleConfirmPassword.textContent = "Hide";
        } else {
            confirmPasswordInput.type = "password";
            toggleConfirmPassword.textContent = "Show";
        }

    });


    // Register Form
    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;


        // Check Empty Fields
        if (!name || !email || !password || !confirmPassword) {

            showMessage(
                "Error!",
                "Please fill in all fields.",
                "error"
            );

            return;
        }


        // Check Email Format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showMessage(
                "Error!",
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        // Check Password
        if (password !== confirmPassword) {

            showMessage(
                "Password Error!",
                "Passwords do not match!",
                "error"
            );

            return;
        }


        // Get existing users
        let users = JSON.parse(localStorage.getItem("users")) || [];


        // Check existing email
        const existingUser = users.find(function (user) {
            return user.email === email;
        });


        if (existingUser) {

            showMessage(
                "Registration Error!",
                "This email is already registered!",
                "error"
            );

            return;
        }


        // Create new user
        const newUser = {
            name: name,
            email: email,
            password: password,
            role: "user"
        };


        // Save user
        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));


        // Registration Success
        showMessage(
            "Account Created Successfully!",
            "Your account has been created successfully. You can now login.",
            "success",
            function () {
                window.location.href = "login.html";
            }
        );

    });

});
