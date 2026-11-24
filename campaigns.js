
document.addEventListener("DOMContentLoaded", function () {

    
    const currentUser = JSON.parse(
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser")
    );

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // Role check
    const role = currentUser.role || "user";

    if (role !== "admin" && role !== "volunteer") {
        alert("Access denied! You cannot access Campaigns.");
        window.location.href = "dashboard.html";
        return;
    }

  
    document.getElementById("userName").textContent = currentUser.name;

    const campaignForm = document.getElementById("campaignForm");
    const formContainer = document.getElementById("campaignFormContainer");
    const addBtn = document.getElementById("addCampaignBtn");
    const cancelBtn = document.getElementById("cancelCampaignBtn");
    const tableBody = document.getElementById("campaignTableBody");
    const searchInput = document.getElementById("searchCampaign");

    let campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];

    
    function saveCampaigns() {
        localStorage.setItem("campaigns", JSON.stringify(campaigns));
    }

  
    function updateStatistics() {

        document.getElementById("totalCampaigns").textContent =
            campaigns.length;

        document.getElementById("activeCampaigns").textContent =
            campaigns.filter(c => c.status === "Active").length;

        document.getElementById("completedCampaigns").textContent =
            campaigns.filter(c => c.status === "Completed").length;
    }

   
    function displayCampaigns(data) {

        tableBody.innerHTML = "";

        if (data.length === 0) {

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 7;
            cell.textContent = "No campaigns found.";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);

            return;
        }

        data.forEach(function (campaign) {

            const row = document.createElement("tr");

            const values = [
                campaign.name,
                campaign.startDate,
                campaign.endDate,
                "৳" + Number(campaign.targetAmount).toLocaleString("en-BD"),
                "৳" + Number(campaign.collectedAmount).toLocaleString("en-BD")
            ];

            values.forEach(function (value) {

                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);

            });

            const statusCell = document.createElement("td");
            const badge = document.createElement("span");

            badge.textContent = campaign.status;
            badge.className = "status-" + campaign.status.toLowerCase();

            statusCell.appendChild(badge);
            row.appendChild(statusCell);

            const actionCell = document.createElement("td");

            const editBtn = document.createElement("button");

            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";
            editBtn.dataset.action = "edit";
            editBtn.dataset.id = campaign.id;

            const deleteBtn = document.createElement("button");

            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.dataset.action = "delete";
            deleteBtn.dataset.id = campaign.id;

            actionCell.appendChild(editBtn);
            actionCell.appendChild(deleteBtn);

            row.appendChild(actionCell);
            tableBody.appendChild(row);

        });
    }

    
    addBtn.addEventListener("click", function () {

        campaignForm.reset();

        document.getElementById("campaignId").value = "";
        document.getElementById("collectedAmount").value = 0;

        document.getElementById("formTitle").textContent =
            "Add New Campaign";

        document.getElementById("saveCampaignBtn").textContent =
            "Save Campaign";

        formContainer.style.display = "block";
    });

    
    cancelBtn.addEventListener("click", function () {

        campaignForm.reset();

        document.getElementById("campaignId").value = "";

        formContainer.style.display = "none";
    });

    
    campaignForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const id = document.getElementById("campaignId").value;

        const name = document.getElementById("campaignName").value.trim();

        const description =
            document.getElementById("campaignDescription").value.trim();

        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        const targetAmount =
            Number(document.getElementById("targetAmount").value);

        const collectedAmount =
            Number(document.getElementById("collectedAmount").value);

        const status = document.getElementById("campaignStatus").value;

        if (endDate < startDate) {
            alert("End date cannot be before start date!");
            return;
        }

        if (targetAmount <= 0 || collectedAmount < 0) {
            alert("Please enter valid campaign amounts!");
            return;
        }

        const campaignData = {
            id: id || Date.now().toString(),
            name,
            description,
            startDate,
            endDate,
            targetAmount,
            collectedAmount,
            status
        };

        if (id) {

            const index = campaigns.findIndex(c => c.id === id);

            if (index !== -1) {
                campaigns[index] = campaignData;
            }

            alert("Campaign updated successfully!");

        } else {

            campaigns.push(campaignData);

            alert("Campaign added successfully!");
        }

        saveCampaigns();

        displayCampaigns(campaigns);
        updateStatistics();

        campaignForm.reset();

        document.getElementById("campaignId").value = "";

        formContainer.style.display = "none";
    });

    // Edit and delete
    tableBody.addEventListener("click", function (event) {

        const button = event.target.closest("button");

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === "edit") {

            const campaign = campaigns.find(c => c.id === id);

            if (!campaign) return;

            document.getElementById("campaignId").value = campaign.id;
            document.getElementById("campaignName").value = campaign.name;

            document.getElementById("campaignDescription").value =
                campaign.description;

            document.getElementById("startDate").value = campaign.startDate;
            document.getElementById("endDate").value = campaign.endDate;

            document.getElementById("targetAmount").value =
                campaign.targetAmount;

            document.getElementById("collectedAmount").value =
                campaign.collectedAmount;

            document.getElementById("campaignStatus").value =
                campaign.status;

            document.getElementById("formTitle").textContent =
                "Edit Campaign";

            document.getElementById("saveCampaignBtn").textContent =
                "Update Campaign";

            formContainer.style.display = "block";
        }

        if (action === "delete") {

            if (!confirm("Are you sure you want to delete this campaign?")) {
                return;
            }

            campaigns = campaigns.filter(c => c.id !== id);

            saveCampaigns();

            displayCampaigns(campaigns);
            updateStatistics();

            alert("Campaign deleted successfully!");
        }

    });

   
    searchInput.addEventListener("input", function () {

        const searchText = searchInput.value.toLowerCase().trim();

        const filtered = campaigns.filter(c =>
            c.name.toLowerCase().includes(searchText)
        );

        displayCampaigns(filtered);
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", function () {

        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");

        alert("You have logged out successfully!");

        window.location.href = "login.html";
    });

    
    displayCampaigns(campaigns);
    updateStatistics();

});
