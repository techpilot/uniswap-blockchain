export const transactionSchema = {
  type: "document",
  name: "transactions",
  title: "Transactions",
  fields: [
    {
      name: "txHash",
      type: "string",
      title: "Transaction Hash",
    },
    {
      name: "fromAddress",
      type: "string",
      title: "From (Wallet Address)",
    },
    {
      name: "toAddress",
      type: "string",
      title: "To (Wallet Address)",
    },
    {
      name: "amount",
      type: "number",
      title: "Amount",
    },
    {
      name: "timestamp",
      type: "datetime",
      title: "Timestamp",
    },
  ],
};
