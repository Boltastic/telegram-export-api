const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Dummy transaction data
let userTransactions = {
  "7145114600": [
    { type: "withdrawal", amount: 4203, date: "2025-03-29" },
    { type: "deposit", amount: 5000, date: "2025-03-28" }
  ]
};

// API to export transactions
app.get("/export/:userId", (req, res) => {
  const userId = req.params.userId;
  const transactions = userTransactions[userId];

  if (!transactions) {
    return res.status(404).send("No transactions found for this user.");
  }

  let fileContent = `📜 Transaction History for User ${userId}\n\n`;
  transactions.forEach((tx, index) => {
    fileContent += `#${index + 1}: ${tx.type.toUpperCase()} - ${tx.amount} INR (📅 ${tx.date})\n`;
  });

  const filePath = `transactions_${userId}.txt`;
  fs.writeFileSync(filePath, fileContent);

  res.download(filePath, () => fs.unlinkSync(filePath));
});

// Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

