// referral.js
const db = firebase.firestore();
const REFERRAL_REWARD = 0.5; // PANCA

async function enterReferralCode(telegram_id, refCode) {
    try {
        const userDocRef = db.collection("users").doc(telegram_id);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            if (userDoc.data().referrer_wallet) {
                alert("You already have a referrer linked.");
                return;
            }

            // Find the wallet of the referrer
            const refQuery = await db.collection("users").where("referral_code", "==", refCode).limit(1).get();
            if (!refQuery.empty) {
                const refWalletId = refQuery.docs[0].data().wallet_id;

                // Link referrer wallet
                await userDocRef.update({ referrer_wallet: refWalletId });

                // Add referral reward to referrer wallet
                const refWalletRef = db.collection("wallets").doc(refWalletId);
                await db.runTransaction(async (t) => {
                    const walletDoc = await t.get(refWalletRef);
                    const currentBalance = walletDoc.data().panc_balance || 0;
                    t.update(refWalletRef, { panc_balance: currentBalance + REFERRAL_REWARD });
                });

                alert(`Referrer linked successfully! ${REFERRAL_REWARD} PANCA credited.`);
            } else {
                alert("Invalid referral code.");
            }
        } else {
            alert("User not found. Start the bot first.");
        }
    } catch (err) {
        console.error("Error linking referral:", err);
    }
}
