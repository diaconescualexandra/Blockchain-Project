// contractConfig.js
export const contractAddressUser = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const contractABIUser = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_age",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_walletAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_role",
				"type": "uint256"
			}
		],
		"name": "setUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "enum UserManagement.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "setUserRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAdd",
				"type": "address"
			}
		],
		"name": "getUserRole",
		"outputs": [
			{
				"internalType": "enum UserManagement.Role",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"internalType": "enum UserManagement.Role",
				"name": "role",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export const contractAddressJob = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
export const contractABIJob = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_escrowServiceAdd",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_userManagement",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "serviceProvider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "BidAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "serviceProvider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "details",
				"type": "string"
			}
		],
		"name": "BidPlaced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "client",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "maxBidValue",
				"type": "uint256"
			}
		],
		"name": "JobCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "client",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum JobManagement.JobStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"name": "JobStatusUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_serviceProvider",
				"type": "address"
			}
		],
		"name": "acceptBid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_serviceProvider",
				"type": "address"
			}
		],
		"name": "acceptBidFromServiceProvider",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_maxBidValue",
				"type": "uint256"
			}
		],
		"name": "createJobTest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllJobs",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "descriptions",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "deadlines",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "maxBidValues",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			}
		],
		"name": "getBids",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "jobId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "serviceProviderAddress",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isAccepted",
						"type": "bool"
					}
				],
				"internalType": "struct BidManagement.Bid[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			}
		],
		"name": "getJobById",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxBidValue",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "clientAddress",
						"type": "address"
					},
					{
						"internalType": "enum JobManagement.JobStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "selectedServiceProvider",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "escrowServiceId",
						"type": "uint256"
					}
				],
				"internalType": "struct JobManagement.Job",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAdd",
				"type": "address"
			}
		],
		"name": "getUserRole",
		"outputs": [
			{
				"internalType": "enum UserManagement.Role",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "jobBidders",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "jobBids",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "details",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "serviceProviderAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isAccepted",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "jobById",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxBidValue",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "clientAddress",
				"type": "address"
			},
			{
				"internalType": "enum JobManagement.JobStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "selectedServiceProvider",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "escrowServiceId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "jobs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxBidValue",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "clientAddress",
				"type": "address"
			},
			{
				"internalType": "enum JobManagement.JobStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "selectedServiceProvider",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "escrowServiceId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_details",
				"type": "string"
			}
		],
		"name": "placeBid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_commission",
				"type": "uint256"
			}
		],
		"name": "priceWithCommission",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_age",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_walletAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_role",
				"type": "uint256"
			}
		],
		"name": "setUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "enum UserManagement.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "setUserRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"internalType": "enum UserManagement.Role",
				"name": "role",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
			
export const contractAddressBid = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
export const contractABIBid = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "serviceProvider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "BidAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "serviceProvider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "details",
				"type": "string"
			}
		],
		"name": "BidPlaced",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_serviceProvider",
				"type": "address"
			}
		],
		"name": "acceptBid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			}
		],
		"name": "getBids",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "jobId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "serviceProviderAddress",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isAccepted",
						"type": "bool"
					}
				],
				"internalType": "struct BidManagement.Bid[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAdd",
				"type": "address"
			}
		],
		"name": "getUserRole",
		"outputs": [
			{
				"internalType": "enum UserManagement.Role",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "jobBidders",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "jobBids",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "jobId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "details",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "serviceProviderAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isAccepted",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jobId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_details",
				"type": "string"
			}
		],
		"name": "placeBid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_commission",
				"type": "uint256"
			}
		],
		"name": "priceWithCommission",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_age",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_walletAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_role",
				"type": "uint256"
			}
		],
		"name": "setUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "enum UserManagement.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "setUserRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"internalType": "enum UserManagement.Role",
				"name": "role",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
