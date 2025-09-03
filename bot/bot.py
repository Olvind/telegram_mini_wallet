import firebase_admin
from firebase_admin import credentials, firestore
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters
import random
import string

# Initialize Firebase
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Generate referral code
def generate_referral_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# /start command
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    telegram_id = str(update.effective_user.id)
    user_doc = db.collection("users").document(telegram_id).get()
    
    if not user_doc.exists:
        # Assign a random wallet
        wallets_ref = db.collection("wallets")
        wallet_query = wallets_ref.where("assigned", "==", False).limit(1).get()
        if wallet_query:
            wallet_data = wallet_query[0].to_dict()
            wallet_id = wallet_data["wallet_id"]
            # Mark wallet as assigned
            wallets_ref.document(wallet_id).update({"assigned": True})
            
            # Generate referral code
            referral_code = generate_referral_code()
            
            # Create user in Firebase
            db.collection("users").document(telegram_id).set({
                "telegram_id": telegram_id,
                "wallet_id": wallet_id,
                "panc_balance": wallet_data["panc_balance"],
                "referral_code": referral_code,
                "referrer_wallet": ""
            })
            await update.message.reply_text(f"Wallet assigned!\nWallet ID: {wallet_id}\nReferral Code: {referral_code}")
        else:
            await update.message.reply_text("No wallets available!")
    else:
        await update.message.reply_text("You already have a wallet linked!")

# /referral command
async def referral(update: Update, context: ContextTypes.DEFAULT_TYPE):
    telegram_id = str(update.effective_user.id)
    user_doc = db.collection("users").document(telegram_id).get()
    if user_doc.exists:
        referral_code = user_doc.to_dict().get("referral_code")
        await update.message.reply_text(f"Your referral code: {referral_code}")
    else:
        await update.message.reply_text("Start first using /start")

# Telegram Bot Setup
app = ApplicationBuilder().token("YOUR_BOT_TOKEN").build()
app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("referral", referral))

app.run_polling()
