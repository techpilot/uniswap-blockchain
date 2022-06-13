require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/Vw_Rk_tNUCnpuNqe2XA5ktS-jcR0gAFg",
      accounts: [
        "25d3ecc78d38447f9bb119c6d165f25c14614231ff4034ed265b5f9a8ad1ae98",
      ],
    },
  },
};
