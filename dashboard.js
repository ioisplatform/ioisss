// =========================================================
// IOIS - MEMBER DASHBOARD
// =========================================================

document.addEventListener("DOMContentLoaded", async function () {

    const loading = document.getElementById("loading");
    const app = document.getElementById("app");

    const welcomeName = document.getElementById("welcomeName");
    const accountStatus = document.getElementById("accountStatus");

    const profileName = document.getElementById("profileName");
    const profileMobile = document.getElementById("profileMobile");
    const profileEmail = document.getElementById("profileEmail");
    const profileCreated = document.getElementById("profileCreated");
    const profileStatus = document.getElementById("profileStatus");
    const memberId = document.getElementById("memberId");
    const memberPlan = document.getElementById("memberPlan");
    const memberStatus = document.getElementById("memberStatus");
    const memberServices = document.getElementById("memberServices");

    const logoutButton = document.getElementById("logoutButton");

    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function formatDate(value) {

        if (!value) {
            return "—";
        }

        try {

            return new Intl.DateTimeFormat(
                "hi-IN",
                {
                    dateStyle: "medium"
                }
            ).format(new Date(value));

        } catch {
            return value;
        }
    }

    function redirectToLogin() {
        window.location.replace("login.html");
    }

    try {

        const authResult = await window.IOIS_AUTH.getUser();

        if (!authResult.user) {
            redirectToLogin();
            return;
        }

        const user = authResult.user;

        const profileResult =
            await window.IOIS_AUTH.getProfile(user.id);

        if (profileResult.error) {

            console.error(
                "Profile loading error:",
                profileResult.error
            );

            // Dashboard can still open using Auth user information.
        }

        const profile = profileResult.profile || {};
        const { data: member } = await window.IOIS_SUPABASE
            .from("members")
            .select("member_id,plan_id,plan_amount,membership_status,selected_services")
            .eq("auth_user_id", user.id)
            .maybeSingle();

        const name =
            profile.full_name ||
            user.user_metadata?.full_name ||
            "IOIS Member";

        const mobile =
            profile.mobile ||
            user.user_metadata?.mobile ||
            "—";

        const email =
            profile.email ||
            user.email ||
            "—";

        const status =
            profile.account_status ||
            "active";

        welcomeName.textContent = name;

        profileName.textContent = name;
        profileMobile.textContent = mobile;
        profileEmail.textContent = email;

        profileCreated.textContent =
            formatDate(
                profile.created_at ||
                user.created_at
            );

        profileStatus.textContent =
            status === "active"
                ? "Active"
                : status;

        accountStatus.textContent =
            status === "active"
                ? "Account Active"
                : "Account " + status;

        if (member) {
            memberId.textContent = member.member_id || "—";
            memberPlan.textContent = member.plan_id ? `${member.plan_id} — ₹${Number(member.plan_amount || 0).toLocaleString("en-IN")}` : "—";
            memberStatus.textContent = member.membership_status || "pending";
            const services = Array.isArray(member.selected_services) ? member.selected_services : [];
            memberServices.textContent = services.length ? services.join(" • ") : "कोई service selected नहीं";
        }

        loading.style.display = "none";
        app.style.display = "block";

    } catch (error) {

        console.error(
            "IOIS Dashboard Error:",
            error
        );

        redirectToLogin();
    }

    logoutButton.addEventListener("click", async function () {

        logoutButton.disabled = true;
        logoutButton.textContent = "Logout हो रहा है...";

        try {

            const result =
                await window.IOIS_AUTH.signOut();

            if (!result.success) {
                console.error(result.error);
                logoutButton.disabled = false;
                logoutButton.textContent = "Logout";
                return;
            }

            window.location.replace("login.html");

        } catch (error) {

            console.error(
                "IOIS Logout Error:",
                error
            );

            logoutButton.disabled = false;
            logoutButton.textContent = "Logout";
        }
    });

});
