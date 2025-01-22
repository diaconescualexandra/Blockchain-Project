import React, { useState, useEffect} from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { contractAddressUser, contractABIUser } from "./contractConfig";
import "./RegisterPage.css";
import { formatEther } from "ethers";

const RegisterPage = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contractUser, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    role: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        const signer = await web3Provider.getSigner();
        const userContract = new ethers.Contract(
          contractAddressUser,
          contractABIUser,
          signer
        );
        setContract(userContract);

        //event treating
        userContract.on("UserAdded", (name, walletAddress, role) => {
          console.log("UserAdded event received:", { name, walletAddress, role :Number(role) });
        });

      } else {
        alert("MetaMask is not installed!");
      }
    };
    init();
  }, []);

  

  //getting balance and address from metamask
  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const accountBalanceWEI = await window.ethereum.request({
        "method": "eth_getBalance",
        "params": [accounts[0]],})
        const accountBalanceETH = formatEther(accountBalanceWEI);
        setBalance(accountBalanceETH);
    } catch (err) {
      console.error("Connection eror:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const registerUser = async () => {
    if (!userData.name || !userData.age || userData.role === null) {
      alert("Fill all the blanks!");
      return;
    }
    try {
      const tx = await contractUser.setUser(
        userData.name,
        parseInt(userData.age),
        account,
        userData.role === "ServiceProvider" ? 0 : 1
      );
      await tx.wait();
      alert("Register succesful!");
      if (userData.role === "ServiceProvider") {
        navigate("/service-provider"); 
      } else {
        navigate("/client"); 
      }
    } catch (err) {
      console.error("Register error", err);
      alert("Error!");
    }
  };

  return (
    <div>
      <h1>User register</h1>
      {!account ? (
        <button onClick={connectWallet}> Connect with MetaMask</button>
      ) : (
        <div>
          <p>Connected address: {account}</p>
          <div>
            <p>Account balance: {balance} </p>
          </div>
        </div>
      )}

      {account && (
        <div>
          <h2>Fill to register:</h2>
          <form>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
            </div>
            <div>
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={userData.age}
                onChange={handleInputChange}
                placeholder="Age"
              />
            </div>
            <div>
              <label>Choose role:</label>
              <button
                type="button"
                onClick={() =>
                  setUserData((prev) => ({ ...prev, role: "ServiceProvider" }))
                }
              >
                Service Provider
              </button>
              <button
                type="button"
                onClick={() =>
                  setUserData((prev) => ({ ...prev, role: "Client" }))
                }
              >
                Client
              </button>
            </div>
          </form>
          {userData.role && (
            <div>
              <p>Role: {userData.role}</p>
              <button onClick={registerUser}>Register</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

