import Navbar from "../components/Navbar";
import ProjectComponent from "../components/ProjectComponent";
import React from "react";

const ProjectScreen = () => {
  return (
    <div className="main-screen">
      <Navbar active="Projects"></Navbar>
      <div className="screen-body">
        <div className="project-container">
          <ProjectComponent
            name="PlanetIX - Mission Control"
            skills="Solidity | Hardhat | Typescript | Javscript"
            image={process.env.PUBLIC_URL + "/images/missioncontrol.png"}
            demo="https://missioncontrol.planetix.com/connect?origin=mission-control___en"
            // github="https://github.com/jourdanDunkley/POTC"
            description="Mission Control is the leading DAPP on Polygon by usage. It has often been #1 in gas usage for almost 2 months straight,
            and has processed over 7 million transactions as of March 17, 2023, since its deployment in late 2022. Mission Control is a staking game
            which consists of a hexagonal grid. There are currently three concentric rings: users can stake assets on the inner ring for free, 
            while the outer ones will cost them a fixed amount of rent per month. Each tile has two layers: one where a user can stake land or 
            territory, and a second layer where they can stake up to 2 pieces of technology such as drones or rovers which will farm the land for 
            various useful in-game assets. The rentals are done using the Superfluid Protocol which enables per-second token streaming, and Connext is leveraged
            for doing crosschain calls. These crosschain calls alert Mission Control as to whether or not the user has staked particular tokens on Ethereum, which would
            give them in-game perks."
          ></ProjectComponent>
          <ProjectComponent
            name="PlanetIX - Prospecting"
            skills="Solidity | Hardhat | Typescript | Javscript"
            image={process.env.PUBLIC_URL + "/images/prospecting.png"}
            demo="https://missioncontrol.planetix.com/connect?origin=mission-control___en"
            // github="https://github.com/jourdanDunkley/POTC"
            description="Prospecting is also a leading DAPP on polygon, close behind Mission Control. it is often #2 in gas usage, and has
            processed over 9 million transactions as of March 17, 2023 since its deployment in late 2022. Prospecting allows users to refine the materials
            they earned from playing Mission Control into more valuable in - game items that can be used to craft new pieces of technology which will give 
            them an advantage. It leverages chainlink VRF for randomizing the rewards and chainlink keeper for automatically fulfilling batched orders. This
            was implemented for gas optimization purposes."
          ></ProjectComponent>
          <ProjectComponent
            name="Parrots Of The Caribbean NFT"
            skills="React | Solidity | Foundry | Node.js | C++ | PHP"
            image={process.env.PUBLIC_URL + "/images/potc-screenshot.png"}
            demo="https://parrotsofthecaribbean.com/"
            github="https://github.com/jourdanDunkley/POTC"
            description="Parrots Of The Caribbean is an NFT Project I launched. I led a team of 15 members, consisting of 
            community moderators, marketers, advisors, artists and developers. The development team consisted of myself and
            one other solidity developer. We worked together on the minting smart contract, and I worked on the art generation which
            involved several different art engines. We created the first fully MP4 NFT collection which features several different songs
            on our NFTs. We audited our contracts in-house and we also had an external audit done which we passed with flying colors."
          ></ProjectComponent>
          <ProjectComponent
            name="Parrots Of The Caribbean Staking"
            skills="React | Solidity | Foundry"
            image={process.env.PUBLIC_URL + "/images/potc-staking.png"}
            github="https://parrotsofthecaribbean.com/stake"
            description="I implemented a Staking system for Parrots of the Caribbean in which holders of the NFT can stake it for
            a an ERC-20 Token reward. This consisted of two contracts: The staking contract and the ERC-20 contract. I audited these
            contracts for security using slither and other automated tools, and I also manually audited them. I also optimized them
            for gas to ensure a seamless user experience. Integrations with the frontend were done using ethers.js. Testing was done
            in foundry."
          ></ProjectComponent>
          <ProjectComponent
            name="Blockchain Invaders"
            skills="React | Solidity | Foundry"
            image={process.env.PUBLIC_URL + "/images/blockchaininvaders.png"}
            demo={"https://jourdandunkley.github.io/jourdan-portfolio/#/game"}
            github="https://github.com/jourdanDunkley/BlockchainInvaders"
            description="Blockchain Invaders is a game built on Polygon Mumbai Testnet that demonstrates the power of Web3 in gaming. 
            Through the use of NFT technology, gamers are given complete ownership over their in-game 
            assets in the form of NFTs. This means you can buy, sell or gift your in-game assets in a 
            fully decentralized manner.
            The characters used in the game are ERC-721 tokens, points scored in the game
            can be redeemed as ERC-20 tokens called $SPACE, and boosts/upgrades can be minted as ERC-1155 tokens using your 
            $SPACE. The game also features an open marketplace where you can buy and sell invaders using the $SPACE token.
            Audits were done manually, and with static analyzer tool slither. Testing was done in foundry."
          ></ProjectComponent>
        </div>
      </div>
    </div>
  );
};

export default ProjectScreen;
