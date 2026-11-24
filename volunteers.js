document.addEventListener("DOMContentLoaded", function () {

    
    const currentUser = JSON.parse(
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser")
    );

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const role = currentUser.role || "user";

    
    if (role !== "admin" && role !== "volunteer") {
        alert("You are not authorized to access this page!");
        window.location.href = "dashboard.html";
        return;
    }

    
    document.getElementById("userName").textContent = currentUser.name;

   
    const volunteerForm = document.getElementById("volunteerForm");
    const formContainer = document.getElementById("volunteerFormContainer");
    const addVolunteerBtn = document.getElementById("addVolunteerBtn");
    const cancelVolunteerBtn = document.getElementById("cancelVolunteerBtn");
    const tableBody = document.getElementById("volunteerTableBody");
    const searchInput = document.getElementById("searchVolunteer");

   
    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];

   
    if (role === "volunteer") {
        addVolunteerBtn.style.display = "none";
        formContainer.style.display = "none";
    }

   
    function saveVolunteers() {
        localStorage.setItem("volunteers", JSON.stringify(volunteers));
    }

   
    function saveUsers() {
        localStorage.setItem("users", JSON.stringify(users));
    }

    
    function updateStatistics() {

        document.getElementById("totalVolunteers").textContent =
            volunteers.length;

        document.getElementById("activeVolunteers").textContent =
            volunteers.filter(function (volunteer) {
                return volunteer.status === "Active";
            }).length;
    }

    
    function displayVolunteers(data) {

        tableBody.innerHTML = "";

        if (data.length === 0) {

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 6;
            cell.textContent = "No volunteers found.";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);

            return;
        }

        data.forEach(function (volunteer) {

            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = volunteer.name;

            const emailCell = document.createElement("td");
            emailCell.textContent = volunteer.email;

            const phoneCell = document.createElement("td");
            phoneCell.textContent = volunteer.phone;

            const addressCell = document.createElement("td");
            addressCell.textContent = volunteer.address;

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.textContent = volunteer.status;
            statusBadge.className = volunteer.status === "Active"
                ? "status-active"
                : "status-inactive";

            statusCell.appendChild(statusBadge);

            const actionCell = document.createElement("td");

            
            if (role === "admin") {

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.className = "edit-btn";
                editBtn.dataset.action = "edit";
                editBtn.dataset.id = volunteer.id;

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.className = "delete-btn";
                deleteBtn.dataset.action = "delete";
                deleteBtn.dataset.id = volunteer.id;

                actionCell.appendChild(editBtn);
                actionCell.appendChild(deleteBtn);
            }

            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(phoneCell);
            row.appendChild(addressCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }

    
    addVolunteerBtn.addEventListener("click", function () {

        if (role !== "admin") return;

        volunteerForm.reset();

        document.getElementById("volunteerId").value = "";

        document.getElementById("formTitle").textContent =
            "Add New Volunteer";

        document.getElementById("saveVolunteerBtn").textContent =
            "Create Volunteer Account";

        formContainer.style.display = "block";
    });

   
    cancelVolunteerBtn.addEventListener("click", function () {

        volunteerForm.reset();

        document.getElementById("volunteerId").value = "";

        formContainer.style.display = "none";
    });

  
    volunteerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (role !== "admin") {
            alert("Only Admin can manage volunteer accounts!");
            return;
        }

        const id = document.getElementById("volunteerId").value;

        const name = document.getElementById("volunteerName").value.trim();
        const email = document.getElementById("volunteerEmail").value.trim();
        const phone = document.getElementById("volunteerPhone").value.trim();
        const address = document.getElementById("volunteerAddress").value.trim();
        const status = document.getElementById("volunteerStatus").value;

    
        const duplicateVolunteer = volunteers.some(function (volunteer) {
            return volunteer.email.toLowerCase() === email.toLowerCase()
                && volunteer.id !== id;
        });

        if (duplicateVolunteer) {
            alert("This email is already registered as a volunteer!");
            return;
        }

        if (id) {

           
            const index = volunteers.findIndex(function (volunteer) {
                return volunteer.id === id;
            });

            if (index === -1) return;

            const oldEmail = volunteers[index].email;


            const duplicateUser = users.some(function (user) {
                return user.email.toLowerCase() === email.toLowerCase()
                    && user.email.toLowerCase() !== oldEmail.toLowerCase();
            });

            if (duplicateUser) {
                alert("This email is already used by another account!");
                return;
            }

            
            const linkedUser = users.find(function (user) {
                return user.email.toLowerCase() === oldEmail.toLowerCase()
                    && user.role === "volunteer";
            });

            if (linkedUser) {
                linkedUser.name = name;
                linkedUser.email = email;
                saveUsers();
            }

          
            volunteers[index] = {
                id: id,
                name: name,
                email: email,
                phone: phone,
                address: address,
                status: status
            };

            alert("Volunteer updated successfully!");

        } else {

           
            const existingUser = users.some(function (user) {
                return user.email.toLowerCase() === email.toLowerCase();
            });

            if (existingUser) {
                alert("This email already has an account!");
                return;
            }

            
            const password = prompt(
                "Create a login password for this Volunteer:"
            );

            if (password === null) return;

            if (password.trim().length < 6) {
                alert("Password must be at least 6 characters long!");
                return;
            }

            const confirmPassword = prompt(
                "Confirm the Volunteer password:"
            );

            if (confirmPassword === null) return;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

          
            const newUser = {
                name: name,
                email: email,
                password: password,
                role: "volunteer"
            };

            users.push(newUser);
            saveUsers();

          
            const newVolunteer = {
                id: Date.now().toString(),
                name: name,
                email: email,
                phone: phone,
                address: address,
                status: status
            };

            volunteers.push(newVolunteer);

            alert("Volunteer account created successfully!");
        }

        saveVolunteers();

        displayVolunteers(volunteers);
        updateStatistics();

        volunteerForm.reset();
        document.getElementById("volunteerId").value = "";
        formContainer.style.display = "none";
    });

    
    tableBody.addEventListener("click", function (event) {

        if (role !== "admin") return;

        const button = event.target.closest("button");

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === "edit") {

            const volunteer = volunteers.find(function (item) {
                return item.id === id;
            });

            if (!volunteer) return;

            document.getElementById("volunteerId").value = volunteer.id;
            document.getElementById("volunteerName").value = volunteer.name;
            document.getElementById("volunteerEmail").value = volunteer.email;
            document.getElementById("volunteerPhone").value = volunteer.phone;
            document.getElementById("volunteerAddress").value = volunteer.address;
            document.getElementById("volunteerStatus").value = volunteer.status;

            document.getElementById("formTitle").textContent =
                "Edit Volunteer";

            document.getElementById("saveVolunteerBtn").textContent =
                "Update Volunteer";

            formContainer.style.display = "block";
        }

        if (action === "delete") {

            const volunteer = volunteers.find(function (item) {
                return item.id === id;
            });

            if (!volunteer) return;

            const confirmDelete = confirm(
                "Are you sure you want to delete this volunteer and their login account?"
            );

            if (!confirmDelete) return;

            // Remove volunteer record
            volunteers = volunteers.filter(function (item) {
                return item.id !== id;
            });

          
            users = users.filter(function (user) {
                return !(
                    user.email.toLowerCase() === volunteer.email.toLowerCase()
                    && user.role === "volunteer"
                );
            });

            saveVolunteers();
            saveUsers();

            displayVolunteers(volunteers);
            updateStatistics();

            alert("Volunteer and login account deleted successfully!");
        }
    });

    
    searchInput.addEventListener("input", function () {

        const searchText = searchInput.value.toLowerCase().trim();

        const filteredVolunteers = volunteers.filter(function (volunteer) {

            return volunteer.name.toLowerCase().includes(searchText) ||
                   volunteer.email.toLowerCase().includes(searchText);
        });

        displayVolunteers(filteredVolunteers);
    });

    
    document.getElementById("logoutBtn").addEventListener("click", function () {

        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");

        alert("You have logged out successfully!");

        window.location.href = "login.html";
    });

    
    displayVolunteers(volunteers);
    updateStatistics();

});