export const userSchema = {
  type: "document",
  name: "users",
  title: "Users",
  fields: [
    {
      name: "address",
      title: "Wallet Address",
      type: "string",
    },
    {
      name: "userName",
      title: "User Name",
      type: "string",
    },
    {
      name: "transactions",
      title: "Transactions",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "transactions" }],
        },
      ],
    },
  ],
};
