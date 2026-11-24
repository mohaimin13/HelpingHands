
document.addEventListener("DOMContentLoaded", function () {

    // Check logged-in user
    const currentUser = JSON.parse(
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser")
    );

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const role = currentUser.role || "user";

    if (!["admin", "volunteer", "user"].includes(role)) {
        alert("Invalid user role!");
        window.location.href = "login.html";
        return;
    }

    // Show user information
   document.getElementById("userName").textContent = currentUser.name;
document.getElementById("userRole").style.display = "none";

    // Get HTML elements
    const donationForm = document.getElementById("donationForm");
    const formContainer = document.getElementById("donationFormContainer");
    const addDonationBtn = document.getElementById("addDonationBtn");
    const cancelDonationBtn = document.getElementById("cancelDonationBtn");
    const tableBody = document.getElementById("donationTableBody");
    const searchInput = document.getElementById("searchDonation");

    const statsContainer = document.getElementById("donationStats");
    const searchContainer = document.getElementById("donationSearchContainer");

    // Load donation data
    let donations = JSON.parse(localStorage.getItem("donations")) || [];

    // Save donations
    function saveDonations() {
        localStorage.setItem("donations", JSON.stringify(donations));
    }

    // Check permissions
    const isManager = role === "admin" || role === "volunteer";

    // Role-based page setup

    if (role === "user") {
    document.querySelectorAll(".management-link").forEach(function (link) {
        link.style.display = "none";
    });
}
    if (role === "user") {

        statsContainer.style.display = "none";
        searchContainer.style.display = "none";

        document.getElementById("pageDescription").textContent =
            "Make donations and view your donation history.";

        document.getElementById("recordsTitle").textContent =
            "My Donation History";

        document.getElementById("recordsDescription").textContent =
            "Your personal donation records.";

        document.getElementById("donorName").readOnly = true;
        document.getElementById("donorEmail").readOnly = true;

    } else {

        document.getElementById("pageDescription").textContent =
            "Manage all donation records.";

        document.getElementById("recordsTitle").textContent =
            "All Donation Records";

        document.getElementById("recordsDescription").textContent =
            "View and manage all donations.";

        addDonationBtn.textContent = "+ Add Donation";
    }

    // Update statistics
    function updateStatistics() {

        if (!isManager) return;

        document.getElementById("totalDonations").textContent =
            donations.length;

        const total = donations.reduce(function (sum, donation) {
            return sum + Number(donation.amount || 0);
        }, 0);

        document.getElementById("totalAmount").textContent =
            "৳" + total.toLocaleString("en-BD");
    }

    // Get donations visible to current user
    function getVisibleDonations() {

        if (isManager) {
            return donations;
        }

        return donations.filter(function (donation) {
            return donation.donorEmail &&
                donation.donorEmail.toLowerCase() ===
                currentUser.email.toLowerCase();
        });
    }

    // Display donations
    function displayDonations(data) {

        tableBody.innerHTML = "";

        if (data.length === 0) {

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 7;
            cell.textContent = "No donations found.";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);

            return;
        }

        data.forEach(function (donation) {

            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = donation.donorName;

            const emailCell = document.createElement("td");
            emailCell.textContent = donation.donorEmail;

            const amountCell = document.createElement("td");
            amountCell.textContent =
                "৳" + Number(donation.amount).toLocaleString("en-BD");

            const dateCell = document.createElement("td");
            dateCell.textContent = donation.date;

            const methodCell = document.createElement("td");
            methodCell.textContent = donation.method;

            const purposeCell = document.createElement("td");
            purposeCell.textContent = donation.purpose;

            const actionCell = document.createElement("td");

            // Only Admin and Volunteer can edit/delete
            if (isManager) {

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.className = "edit-btn";
                editBtn.dataset.action = "edit";
                editBtn.dataset.id = donation.id;

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.className = "delete-btn";
                deleteBtn.dataset.action = "delete";
                deleteBtn.dataset.id = donation.id;

                actionCell.appendChild(editBtn);
                actionCell.appendChild(deleteBtn);
            }

            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(amountCell);
            row.appendChild(dateCell);
            row.appendChild(methodCell);
            row.appendChild(purposeCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }

    // Open donation form
    addDonationBtn.addEventListener("click", function () {

        donationForm.reset();

        document.getElementById("donationId").value = "";

        document.getElementById("formTitle").textContent =
            role === "user" ? "Make a Donation" : "Add New Donation";

        document.getElementById("saveDonationBtn").textContent =
            role === "user" ? "Submit Donation" : "Save Donation";

        // Automatically set User information
        if (role === "user") {
            document.getElementById("donorName").value = currentUser.name;
            document.getElementById("donorEmail").value = currentUser.email;
        }

        formContainer.style.display = "block";
    });

    // Cancel form
    cancelDonationBtn.addEventListener("click", function () {

        donationForm.reset();

        document.getElementById("donationId").value = "";

        formContainer.style.display = "none";
    });

    // Add or Update Donation
    donationForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const id = document.getElementById("donationId").value;

        
        const donorName = role === "user"
            ? currentUser.name
            : document.getElementById("donorName").value.trim();

        const donorEmail = role === "user"
            ? currentUser.email
            : document.getElementById("donorEmail").value.trim();

        const amount = Number(
            document.getElementById("donationAmount").value
        );

        const date = document.getElementById("donationDate").value;
        const method = document.getElementById("donationMethod").value;
        const purpose = document.getElementById("donationPurpose").value.trim();

        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid donation amount!");
            return;
        }

        if (!date || !method || !purpose) {
            alert("Please complete all donation fields!");
            return;
        }

        // User can only donate
        if (role === "user" && id) {
            alert("You cannot edit donation records!");
            return;
        }

        if (id) {

            if (!isManager) return;

            const index = donations.findIndex(function (donation) {
                return donation.id === id;
            });

            if (index === -1) return;

            donations[index] = {
                id: id,
                donorName: donorName,
                donorEmail: donorEmail,
                amount: amount,
                date: date,
                method: method,
                purpose: purpose
            };

            alert("Donation updated successfully!");

        } else {

            const newDonation = {
                id: Date.now().toString(),
                donorName: donorName,
                donorEmail: donorEmail,
                amount: amount,
                date: date,
                method: method,
                purpose: purpose
            };

            donations.push(newDonation);

            alert(
                role === "user"
                    ? "Your donation has been recorded successfully!"
                    : "Donation added successfully!"
            );
        }

        saveDonations();

        displayDonations(getVisibleDonations());
        updateStatistics();

        donationForm.reset();

        document.getElementById("donationId").value = "";

        formContainer.style.display = "none";
    });

   
    tableBody.addEventListener("click", function (event) {

        if (!isManager) return;

        const button = event.target.closest("button");

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === "edit") {

            const donation = donations.find(function (item) {
                return item.id === id;
            });

            if (!donation) return;

            document.getElementById("donationId").value = donation.id;
            document.getElementById("donorName").value = donation.donorName;
            document.getElementById("donorEmail").value = donation.donorEmail;
            document.getElementById("donationAmount").value = donation.amount;
            document.getElementById("donationDate").value = donation.date;
            document.getElementById("donationMethod").value = donation.method;
            document.getElementById("donationPurpose").value = donation.purpose;

            document.getElementById("formTitle").textContent =
                "Edit Donation";

            document.getElementById("saveDonationBtn").textContent =
                "Update Donation";

            formContainer.style.display = "block";
        }

        if (action === "delete") {

            const confirmDelete = confirm(
                "Are you sure you want to delete this donation?"
            );

            if (!confirmDelete) return;

            donations = donations.filter(function (donation) {
                return donation.id !== id;
            });

            saveDonations();

            displayDonations(getVisibleDonations());
            updateStatistics();

            alert("Donation deleted successfully!");
        }
    });

    
    if (isManager) {

        searchInput.addEventListener("input", function () {

            const searchText = searchInput.value.toLowerCase().trim();

            const filteredDonations = getVisibleDonations().filter(
                function (donation) {

                    return donation.donorName.toLowerCase().includes(searchText) ||
                        donation.donorEmail.toLowerCase().includes(searchText);
                }
            );

            displayDonations(filteredDonations);
        });
    }

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", function () {

        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");

        alert("You have logged out successfully!");

        window.location.href = "login.html";
    });

    // Initial display
    displayDonations(getVisibleDonations());
    updateStatistics();

});
