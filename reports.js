
document.addEventListener("DOMContentLoaded", function () {

   
    const currentUser = JSON.parse(
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser")
    );

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    
    if (currentUser.role === "user") {
        alert("You do not have permission to access this page!");
        window.location.href = "dashboard.html";
        return;
    }

    if (
        currentUser.role !== "admin" &&
        currentUser.role !== "volunteer"
    ) {
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("userName").textContent = currentUser.name;


    
    const volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
    const donations = JSON.parse(localStorage.getItem("donations")) || [];
    const campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];
    const distributions = JSON.parse(localStorage.getItem("distributions")) || [];


    
    function updateReportStatistics() {

        const totalDonationAmount = donations.reduce(function (total, donation) {
            return total + Number(donation.amount || 0);
        }, 0);

        document.getElementById("reportVolunteers").textContent =
            volunteers.length;

        document.getElementById("reportDonationCount").textContent =
            donations.length;

        document.getElementById("reportDonationAmount").textContent =
            "৳" + totalDonationAmount.toLocaleString("en-BD");

        document.getElementById("reportCampaigns").textContent =
            campaigns.length;

        document.getElementById("reportActiveCampaigns").textContent =
            campaigns.filter(function (campaign) {
                return campaign.status === "Active";
            }).length;

        document.getElementById("reportDistributions").textContent =
            distributions.length;
    }


    
    function displayDonationReport() {

        const tableBody = document.getElementById("reportDonationTable");

        tableBody.innerHTML = "";

        if (donations.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 5;
            cell.textContent = "No donation records available.";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        donations.forEach(function (donation) {

            const row = document.createElement("tr");

            const values = [
                donation.donorName,
                donation.donorEmail,
                "৳" + Number(donation.amount).toLocaleString("en-BD"),
                donation.date,
                donation.method
            ];

            values.forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    }


   
    function displayCampaignReport() {

        const tableBody = document.getElementById("reportCampaignTable");

        tableBody.innerHTML = "";

        if (campaigns.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 4;
            cell.textContent = "No campaign records available.";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        campaigns.forEach(function (campaign) {

            const row = document.createElement("tr");

            const values = [
                campaign.name,
                "৳" + Number(campaign.targetAmount).toLocaleString("en-BD"),
                "৳" + Number(campaign.collectedAmount).toLocaleString("en-BD"),
                campaign.status
            ];

            values.forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    }


  
    function displayDistributionReport() {

        const tableBody = document.getElementById("reportDistributionTable");

        tableBody.innerHTML = "";

        if (distributions.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 5;
            cell.textContent = "No distribution records available.";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        distributions.forEach(function (item) {

            const row = document.createElement("tr");

            const values = [
                item.recipientName,
                item.itemName,
                item.quantity,
                item.date,
                item.status
            ];

            values.forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    }


    document.getElementById("logoutBtn").addEventListener("click", function () {

        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");

        alert("You have logged out successfully!");

        window.location.href = "login.html";

    });


   
    updateReportStatistics();
    displayDonationReport();
    displayCampaignReport();
    displayDistributionReport();

});
