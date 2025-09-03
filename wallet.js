// wallet.js

const db = firebase.firestore();

// Load wallet info for current Telegram user
async function loadWallet(telegram_id) {
    try {
        const userDoc = await db.collection("users").doc(telegram_id).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            document.getElementById("wallet_id").innerText = data.wallet_id;
            document.getElementById("balance").innerText = data.panc_balance;
            document.getElementById("referral_code").innerText = data.referral_code;
        } else {
            alert("Wallet not found. Please start the bot first.");
        }
    } catch (err) {
        console.error("Error fetching wallet:", err);
    }
}

// Export private key (dummy alert for now)
async function exportKey(telegram_id) {
    try {
        const userDoc = await db.collection("users").doc(telegram_id).get();
        if (userDoc.exists) {
            const wallet_id = userDoc.data().wallet_id;
            const walletDoc = await db.collection("wallets").doc(wallet_id).get();
            if (walletDoc.exists) {
                const privKey = walletDoc.data().private_key;
                // In real app, download as Word/backup file
                alert(`Private Key for wallet ${wallet_id}: ${privKey}`);
            }
        }
    } catch (err) {
        console.error("Error exporting key:", err);
    }
}
