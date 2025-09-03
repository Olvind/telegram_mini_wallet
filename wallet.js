// Generate random wallet data for demo (you can later replace with backend/db)
function generateWallet() {
  const walletId = "0x" + Math.random().toString(16).substring(2, 12).toUpperCase();
  const balance = (Math.random() * 10).toFixed(3); // random balance
  const referral = "REF-" + Math.random().toString(36).substring(2, 7).toUpperCase();
  const privateKey = "PRIV-" + Math.random().toString(36).substring(2, 15).toUpperCase();

  return { walletId, balance, referral, privateKey };
}

const wallet = generateWallet();

window.onload = () => {
  document.getElementById("wallet-id").textContent = wallet.walletId;
  document.getElementById("wallet-balance").textContent = wallet.balance;
  document.getElementById("referral-code").textContent = wallet.referral;

  document.getElementById("export-key").addEventListener("click", () => {
    alert("Your Private Key:\n" + wallet.privateKey);
  });
};

