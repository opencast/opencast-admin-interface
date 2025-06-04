const bc = new BroadcastChannel("auth_channel");

export const broadcastLogout = () => {
    bc.postMessage({ type: "LOGOUT" });
};

export const subscribeToAuthEvents = () => {
    bc.onmessage = event => {
        if (event.data?.type === "LOGOUT") {
            performOnLogoutActions();
        }
    };
};

const performOnLogoutActions = () => {
    // We need a tiny pause, in order to make sure the logout process has happened.
    const intvl = setInterval(() => {
        window.location.href = "/login.html";
        clearInterval(intvl);
    }, 750);
};
