
document.addEventListener("DOMContentLoaded", function () {

    // Check login
    const currentUser = JSON.parse(
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser")
    );

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // Role-based access
    if (currentUser.role === "user") {
        alert("You do not have permission to access this page!");
        window.location.href = "dashboard.html";
        return;
    }

    if (currentUser.role !== "admin" && currentUser.role !== "volunteer") {
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("userName").textContent = currentUser.name;

    const distributionForm = document.getElementById("distributionForm");
    const formContainer = document.getElementById("distributionFormContainer");
    const addBtn = document.getElementById("addDistributionBtn");
    const cancelBtn = document.getElementById("cancelDistributionBtn");
    const tableBody = document.getElementById("distributionTableBody");
    const searchInput = document.getElementById("searchDistribution");

    let distributions =
        JSON.parse(localStorage.getItem("distributions")) || [];

    function saveDistributions() {
        localStorage.setItem("distributions", JSON.stringify(distributions));
    }

    function updateStatistics() {
        document.getElementById("totalDistributions").textContent =
            distributions.length;

        document.getElementById("completedDistributions").textContent =
            distributions.filter(d => d.status === "Distributed").length;

        document.getElementById("pendingDistributions").textContent =
            distributions.filter(d => d.status === "Pending").length;
    }

    function displayDistributions(data) {
        tableBody.innerHTML = "";

        if (data.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 8;
            cell.textContent = "No distribution records found.";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        data.forEach(function (item) {
            const row = document.createElement("tr");

            const values = [
                item.recipientName,
                item.phone,
                item.address,
                item.itemName,
                item.quantity,
                item.date
            ];

            values.forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const statusCell = document.createElement("td");
            const badge = document.createElement("span");

            badge.textContent = item.status;
            badge.className = "status-" + item.status.toLowerCase();

            statusCell.appendChild(badge);
            row.appendChild(statusCell);

            const actionCell = document.createElement("td");

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";
            editBtn.dataset.action = "edit";
            editBtn.dataset.id = item.id;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.dataset.action = "delete";
            deleteBtn.dataset.id = item.id;

            actionCell.appendChild(editBtn);
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }

    // Open form
    addBtn.addEventListener("click", function () {
        distributionForm.reset();

        document.getElementById("distributionId").value = "";
        document.getElementById("formTitle").textContent =
            "Add New Distribution";

        document.getElementById("saveDistributionBtn").textContent =
            "Save Distribution";

        formContainer.style.display = "block";
    });

    // Cancel form
    cancelBtn.addEventListener("click", function () {
        distributionForm.reset();
        document.getElementById("distributionId").value = "";
        formContainer.style.display = "none";
    });

    // Add or update distribution
    distributionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (
            currentUser.role !== "admin" &&
            currentUser.role !== "volunteer"
        ) {
            alert("You do not have permission to perform this action!");
            return;
        }

        const id = document.getElementById("distributionId").value;

        const recipientName =
            document.getElementById("recipientName").value.trim();

        const phone =
            document.getElementById("recipientPhone").value.trim();

        const address =
            document.getElementById("recipientAddress").value.trim();

        const itemName =
            document.getElementById("itemName").value.trim();

        const quantity =
            Number(document.getElementById("quantity").value);

        const date =
            document.getElementById("distributionDate").value;

        const status =
            document.getElementById("distributionStatus").value;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity!");
            return;
        }

        const distributionData = {
            id: id || Date.now().toString(),
            recipientName,
            phone,
            address,
            itemName,
            quantity,
            date,
            status
        };

        if (id) {
            const index = distributions.findIndex(d => d.id === id);

            if (index !== -1) {
                distributions[index] = distributionData;
            }

            alert("Distribution updated successfully!");
        } else {
            distributions.push(distributionData);
            alert("Distribution added successfully!");
        }

        saveDistributions();
        displayDistributions(distributions);
        updateStatistics();

        distributionForm.reset();
        document.getElementById("distributionId").value = "";
        formContainer.style.display = "none";
    });

    // Edit and delete
    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest("button");

        if (!button) return;

        if (
            currentUser.role !== "admin" &&
            currentUser.role !== "volunteer"
        ) {
            alert("You do not have permission to perform this action!");
            return;
        }

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === "edit") {
            const item = distributions.find(d => d.id === id);

            if (!item) return;

            document.getElementById("distributionId").value = item.id;
            document.getElementById("recipientName").value = item.recipientName;
            document.getElementById("recipientPhone").value = item.phone;
            document.getElementById("recipientAddress").value = item.address;
            document.getElementById("itemName").value = item.itemName;
            document.getElementById("quantity").value = item.quantity;
            document.getElementById("distributionDate").value = item.date;
            document.getElementById("distributionStatus").value = item.status;

            document.getElementById("formTitle").textContent =
                "Edit Distribution";

            document.getElementById("saveDistributionBtn").textContent =
                "Update Distribution";

            formContainer.style.display = "block";
        }

        if (action === "delete") {
            if (!confirm("Are you sure you want to delete this record?")) {
                return;
            }

            distributions = distributions.filter(d => d.id !== id);

            saveDistributions();
            displayDistributions(distributions);
            updateStatistics();

            alert("Distribution deleted successfully!");
        }
    });

    // Search
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase().trim();

        const filtered = distributions.filter(d =>
            d.recipientName.toLowerCase().includes(searchText) ||
            d.itemName.toLowerCase().includes(searchText)
        );

        displayDistributions(filtered);
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");

        alert("You have logged out successfully!");
        window.location.href = "login.html";
    });

    displayDistributions(distributions);
    updateStatistics();

});
