import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../lib/constants";
import { client } from "../lib/sanityClient";
import { useRouter } from "next/router";

export const TransactionContext = React.createContext();

let eth;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

// interaction with smart contract
const getEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
  });

  const router = useRouter();

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // create user profile in sanity
  useEffect(() => {
    if (!currentAccount) return;

    (async () => {
      const userDoc = {
        _type: "users",
        _id: currentAccount,
        userName: "unnamed",
        address: currentAccount,
      };

      await client.createIfNotExists(userDoc);
    })();
  }, [currentAccount]);

  // connect to ethereum wallet functionality
  const connectWallet = async (metamask = eth) => {
    try {
      if (!window.ethereum) return alert("Please install an ethereum wallet");
      console.log("metamask", metamask);
      console.log("eth", window.ethereum);
      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum Object.");
    }
  };

  // checks if there is any connected wallet
  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install an ethereum wallet");

      const accounts = await metamask.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log("Wallet is already connected");
      }
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  // saves transaction to sanity DB
  const saveTransaction = async (
    txHash,
    amount,
    fromAddress = currentAccount,
    toAddress
  ) => {
    const txDoc = {
      _type: "transactions",
      _id: txHash,
      fromAddress,
      toAddress,
      amount: parseFloat(amount),
      timestamp: new Date(Date.now()).toISOString(),
      txHash,
    };

    await client.createIfNotExists(txDoc);

    await client
      .patch(currentAccount)
      .setIfMissing({ transactions: [] })
      .insert("after", "transactions[-1]", [
        {
          _key: txHash,
          _ref: txHash,
          _type: "reference",
        },
      ])
      .commit();

    return;
  };

  // sends eth to address
  const sendTransaction = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    try {
      if (!metamask) return alert("Please install an ethereum wallet");
      const { addressTo, amount } = formData;
      const transactionContract = await getEthereumContract();

      const parsedAmount = ethers.utils.parseEther(amount);

      await metamask.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: "0x7EF40", // 520000 Gwei
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferring ETH ${parsedAmount} to ${addressTo}`,
        "TRANSFER"
      );

      setIsLoading(true);

      await transactionHash.wait();

      // DB
      await saveTransaction(
        transactionHash.hash,
        amount,
        connectedAccount,
        addressTo
      );

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // Trigger loading modal
  useEffect(() => {
    if (isLoading) {
      router.push(`/?loading=${currentAccount}`);
    } else {
      router.push(`/`);
    }
  }, [isLoading]);

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        sendTransaction,
        handleChange,
        formData,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
