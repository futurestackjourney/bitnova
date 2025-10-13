// src/pages/Deposit.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Modal from "../components/FormAlert";
import visaLogo from "/images/visa.png";
import mcLogo from "/images/mastercard.png";
import amexLogo from "/images/amex.png";

/*
  Demo logic:
  - checks users/{uid}/savedMethods for a matching method OR global demoAccounts collection.
  - if none found but user checked "Save this method" it saves the method then deposits.
  - writes deposit document to users/{uid}/deposits
*/

function SmallLabel({ children }) {
  return <label className="block text-xs text-gray-300 mb-1">{children}</label>;
}

export default function Deposit() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  const [method, setMethod] = useState("card");
  const [amount, setAmount] = useState("");
  const [saveMethod, setSaveMethod] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  // form values
  const [form, setForm] = useState({
    holderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    paypalEmail: "",
    stripeId: "",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [cardType, setCardType] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingUser(false);
      if (!u) {
        // Not logged in — redirect to login
        navigate("/login", { replace: true, state: { from: "/deposit" } });
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (k) => (e) => {
    setForm((s) => ({ ...s, [k]: e.target.value }));
  };

  const maskLast4 = (num) => {
    const cleaned = (num || "").replace(/\s+/g, "");
    return cleaned.length >= 4 ? cleaned.slice(cleaned.length - 4) : cleaned;
  };

  const checkSavedOrDemo = async () => {
    // check users/{uid}/savedMethods for a matching method
    const savedRef = collection(db, "users", user.uid, "savedMethods");
    let q;
    if (method === "card") {
      q = query(
        savedRef,
        where("type", "==", "card"),
        where("cardNumber", "==", form.cardNumber)
      );
    } else if (method === "paypal") {
      q = query(
        savedRef,
        where("type", "==", "paypal"),
        where("email", "==", form.paypalEmail)
      );
    } else {
      q = query(
        savedRef,
        where("type", "==", "stripe"),
        where("stripeId", "==", form.stripeId)
      );
    }
    const snap = await getDocs(q);
    if (!snap.empty) return true;

    // check global demoAccounts (optional collection you can seed)
    const demoRef = collection(db, "demoAccounts");
    if (method === "card") {
      q = query(
        demoRef,
        where("type", "==", "card"),
        where("cardNumber", "==", form.cardNumber)
      );
    } else if (method === "paypal") {
      q = query(
        demoRef,
        where("type", "==", "paypal"),
        where("email", "==", form.paypalEmail)
      );
    } else {
      q = query(
        demoRef,
        where("type", "==", "stripe"),
        where("stripeId", "==", form.stripeId)
      );
    }
    const demoSnap = await getDocs(q);
    return !demoSnap.empty;
  };

  const saveMethodForUser = async () => {
    const savedRef = collection(db, "users", user.uid, "savedMethods");
    const payload =
      method === "card"
        ? {
            type: "card",
            holderName: form.holderName || "",
            cardNumber: form.cardNumber || "",
            expiryDate: form.expiryDate || "",
            cvc: form.cvc || "",
            createdAt: serverTimestamp(),
          }
        : method === "paypal"
        ? {
            type: "paypal",
            email: form.paypalEmail || "",
            createdAt: serverTimestamp(),
          }
        : {
            type: "stripe",
            stripeId: form.stripeId || "",
            createdAt: serverTimestamp(),
          };

    await addDoc(savedRef, payload);
  };

  const createDeposit = async () => {
    const depositsRef = collection(db, "users", user.uid, "deposits");
    const payload = {
      method,
      amount: Number(amount),
      currency: "USD",
      status: "success",
      createdAt: serverTimestamp(),
    };

    if (method === "card") {
      payload.card = {
        holderName: form.holderName,
        cardNumber: form.cardNumber,
        expiryDate: form.expiryDate,
        cvc: form.cvc,
      };
    } else if (method === "paypal") {
      payload.paypal = { email: form.paypalEmail };
    } else {
      payload.stripe = { stripeId: form.stripeId };
    }

    await addDoc(depositsRef, payload);

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      balance: increment(Number(amount)), // will add deposit to current balance
    });
  };

  // Format card number (xxxx-xxxx-xxxx...)
  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // only digits
    if (value.length > 15) value = value.slice(0, 15);
    let formatted = value.match(/.{1,4}/g)?.join("-") || value;
    setForm((s) => ({ ...s, cardNumber: formatted }));

    // Detect card type
    if (/^4/.test(value)) setCardType("visa");
    else if (/^5[1-5]/.test(value)) setCardType("mastercard");
    else if (/^3[47]/.test(value)) setCardType("amex");
    else setCardType(null);
  };

  // Format expiry MM/YY
  const handleExpiry = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // only numbers
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    setForm((s) => ({ ...s, expiryDate: value }));
  };

  // Validate expiry date
  const isExpired = (expiry) => {
    if (!expiry.includes("/")) return true;
    const [mm, yy] = expiry.split("/");
    const month = parseInt(mm, 10);
    const year = parseInt("20" + yy, 10);
    if (!month || month < 1 || month > 12) return true;
    const now = new Date();
    const expDate = new Date(year, month);
    return expDate < now;
  };

  // Format CVC
  const handleCvc = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setForm((s) => ({ ...s, cvc: value }));
  };

  // --- handle submit with confirmation ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setMessage("Enter a valid amount");
      return;
    }
    if (method === "card" && isExpired(form.expiryDate)) {
      setMessage("Card is expired ❌");
      return;
    }
    // Open confirm modal instead of direct deposit
    setConfirmOpen(true);
  };

  // --- confirmed deposit ---
  const confirmDeposit = async () => {
    setConfirmOpen(false);
    setBusy(true);
    try {
      const matched = await checkSavedOrDemo();
      if (!matched && saveMethod) await saveMethodForUser();
      await createDeposit();
      setSuccessOpen(true);
      setAmount("");
      setForm({
        holderName: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        paypalEmail: "",
        stripeId: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center bg-no-repeat bg-blend-overlay bg-white/20 dark:bg-black/50"
      style={{ backgroundImage: "url('/images/tiles3.jpg')" }}
    >
      <div className="max-w-2xl mx-auto mt-12 bg-zinc-500/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-700 rounded-2xl shadow-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4 text-zinc-800 dark:text-white">
          Deposit Demo Funds
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <SmallLabel>Amount (USD)</SmallLabel>
            <input
              required
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field bg-white/10 dark:bg-zinc-800/40"
            />
          </div>

          <div>
            <SmallLabel>Payment Method</SmallLabel>
            <div className="flex gap-3">
              {["card", "paypal", "stripe"].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-3 py-2 rounded text-sm ${
                    method === m
                      ? "bg-green-500 text-black"
                      : "bg-zinc-400 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {m === "card" ? "Card" : m === "paypal" ? "PayPal" : "Stripe"}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional forms */}
          {method === "card" && (
            <div className="grid grid-cols-1 gap-3">
              <div>
                <SmallLabel>Card Number (demo)</SmallLabel>
                <div className="relative">
                  <input
                    className="input-field bg-white/10 dark:bg-zinc-800/40 pr-12"
                    value={form.cardNumber}
                    onChange={handleCardNumber}
                    placeholder="4242-4242-4242-424"
                    required
                  />
                  {cardType && (
                    <img
                      src={
                        cardType === "visa"
                          ? visaLogo
                          : cardType === "mastercard"
                          ? mcLogo
                          : amexLogo
                      }
                      alt={cardType}
                      className="absolute right-3 top-2 h-6"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <SmallLabel>Expiry (MM/YY)</SmallLabel>
                  <input
                    value={form.expiryDate}
                    onChange={handleExpiry}
                    className="input-field bg-white/10 dark:bg-zinc-800/40"
                    placeholder="12/28"
                    required
                  />
                </div>
                <div>
                  <SmallLabel>CVC</SmallLabel>
                  <input
                    value={form.cvc}
                    onChange={handleCvc}
                    className="input-field bg-white/10 dark:bg-zinc-800/40"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {method === "paypal" && (
            <div>
              <SmallLabel>PayPal Email (demo)</SmallLabel>
              <input
                className="input-field bg-white/10 dark:bg-zinc-800/40"
                value={form.paypalEmail}
                onChange={handleChange("paypalEmail")}
                placeholder="demo@paypal.com"
                required
              />
            </div>
          )}

          {method === "stripe" && (
            <div>
              <SmallLabel>Stripe Demo ID</SmallLabel>
              <input
                className="input-field bg-white/10 dark:bg-zinc-800/40"
                value={form.stripeId}
                onChange={handleChange("stripeId")}
                placeholder="stripe_demo_123"
                required
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              id="save"
              type="checkbox"
              checked={saveMethod}
              onChange={(e) => setSaveMethod(e.target.checked)}
            />
            <label htmlFor="save" className="text-sm text-gray-300">
              Save this method (demo)
            </label>
          </div>

          {message && <div className="text-sm text-amber-400">{message}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 bg-green-500 rounded"
            >
              {busy ? "Processing..." : "Deposit (Demo)"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded bg-zinc-400 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-400">
          <strong>Note:</strong> This is demo-only. Do not use real card
          details.
        </div>
      </div>
      <Modal
        open={confirmOpen}
        title="Confirm Deposit"
        onClose={() => setConfirmOpen(false)}
        actions={[
          { label: "Cancel", onClick: () => setConfirmOpen(false) },
          { label: "Confirm", variant: "primary", onClick: confirmDeposit },
        ]}
      >
        Are you sure you want to deposit <b>${amount}</b>?
      </Modal>

      {/* Success Modal */}
      <Modal
        open={successOpen}
        title="Deposit Successful"
        onClose={() => setSuccessOpen(false)}
        actions={[
          {
            label: "OK",
            variant: "primary",
            onClick: () => setSuccessOpen(false),
          },
        ]}
      >
        Your deposit of <b>${amount}</b> has been added to your balance.
      </Modal>
    </div>
  );
}
