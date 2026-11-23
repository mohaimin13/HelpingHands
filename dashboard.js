
document.addEventListener("DOMContentLoaded", function () {

    // Get logged-in user
    const currentUser = JSON.parse(
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser")
    );

    // Check login status
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }


    // Get user role
    const role = currentUser.role || "user";


    // Show user information
document.getElementById("userName").textContent = currentUser.name;
document.getElementById("welcomeName").textContent = currentUser.name;

document.getElementById("userRole").style.display = "none";


    // Dashboard elements
    const adminStats = document.getElementById("adminStats");
    const userSection = document.getElementById("userSection");
    const welcomeMessage = document.getElementById("welcomeMessage");

    const managementLinks =
        document.querySelectorAll(".management-link");


    // Role-based Dashboard
    if (role === "admin") {

        welcomeMessage.textContent =
            "Welcome Admin! You have full control of HelpingHands.";

        adminStats.style.display = "grid";

        userSection.style.display = "none";

        managementLinks.forEach(function (link) {
            link.style.display = "";
        });

    }

    else if (role === "volunteer") {

        welcomeMessage.textContent =
            "Welcome Volunteer! Manage your organization activities.";

        adminStats.style.display = "grid";

        userSection.style.display = "none";

        managementLinks.forEach(function (link) {
            link.style.display = "";
        });

    }

    else if (role === "user") {

        welcomeMessage.textContent =
            "Welcome! Thank you for supporting us.";

        adminStats.style.display = "none";

        userSection.style.display = "block";

        managementLinks.forEach(function (link) {
            link.style.display = "none";
        });

    }

    else {

        alert("Invalid user role!");

        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");

        window.location.href = "login.html";

        return;
    }


    // Get dashboard data
    const volunteers =
        JSON.parse(localStorage.getItem("volunteers")) || [];

    const donations =
        JSON.parse(localStorage.getItem("donations")) || [];

    const campaigns =
        JSON.parse(localStorage.getItem("campaigns")) || [];

    const distributions =
        JSON.parse(localStorage.getItem("distributions")) || [];


    // Update statistics for Admin and Volunteer
    if (role === "admin" || role === "volunteer") {

        document.getElementById("totalVolunteers").textContent =
            volunteers.length;

        document.getElementById("totalDonations").textContent =
            "৳" + donations.reduce(function (total, donation) {
                return total + Number(donation.amount || 0);
            }, 0);

        document.getElementById("activeCampaigns").textContent =
            campaigns.filter(function (campaign) {
                return campaign.status === "Active";
            }).length;

        document.getElementById("totalDistributions").textContent =
            distributions.length;

    }


    // Logout
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");

        alert("You have logged out successfully!");

        window.location.href = "login.html";

    });

});
