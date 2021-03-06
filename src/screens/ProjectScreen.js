import Navbar from '../components/Navbar'
import ProjectComponent from '../components/ProjectComponent'
import React from 'react'

const ProjectScreen = () => {
  return (
    <div className='main-screen'>
      <Navbar active='Projects'></Navbar>
      <div className='screen-body'>
        <div className='project-container'>
          <ProjectComponent
            name='Parrots Of The Caribbean NFT'
            skills='React | Solidity | Foundry | Node.js | C++ | PHP'
            image={process.env.PUBLIC_URL + '/images/potc-screenshot.png'}
            demo='https://parrotsofthecaribbean.com/'
            github='https://github.com/jourdanDunkley/POTC'
            description='Parrots Of The Caribbean is an NFT Project I launched. I led a team of 15 members, consisting of 
            community moderators, marketers, advisors, artists and developers. The development team consisted of myself and
            one other solidity developer. We worked together on the minting smart contract, and I worked on the art generation which
            involved several different art engines. We created the first fully MP4 NFT collection which features several different songs
            on our NFTs. We audited our contracts in-house and we also had an external audit done which we passed with flying colors.'
          ></ProjectComponent>
          <ProjectComponent
            name='Parrots Of The Caribbean Staking'
            skills='React | Solidity | Foundry'
            image={process.env.PUBLIC_URL + '/images/potc-staking.png'}
            github='https://parrotsofthecaribbean.com/stake'
            description='I implemented a Staking system for Parrots of the Caribbean in which holders of the NFT can stake it for
            a an ERC-20 Token reward. This consisted of two contracts: The staking contract and the ERC-20 contract. I audited these
            contracts for security using slither and other automated tools, and I also manually audited them. I also optimized them
            for gas to ensure a seamless user experience. Integrations with the frontend were done using ethers.js. Testing was done
            in foundry.'
          ></ProjectComponent>
          <ProjectComponent
            name='Blockchain Invaders'
            skills='React | Solidity | Foundry'
            image={process.env.PUBLIC_URL + '/images/blockchaininvaders.png'}
            demo={'https://jourdandunkley.github.io/jourdan-portfolio/#/game'}
            github='https://github.com/jourdanDunkley/BlockchainInvaders'
            description='Blockchain Invaders is a game built on Polygon Mumbai Testnet that demonstrates the power of Web3 in gaming. 
            Through the use of NFT technology, gamers are given complete ownership over their in-game 
            assets in the form of NFTs. This means you can buy, sell or gift your in-game assets in a 
            fully decentralized manner.
            The characters used in the game are ERC-721 tokens, points scored in the game
            can be redeemed as ERC-20 tokens called $SPACE, and boosts/upgrades can be minted as ERC-1155 tokens using your 
            $SPACE. The game also features an open marketplace where you can buy and sell invaders using the $SPACE token.
            Audits were done manually, and with static analyzer tool slither. Testing was done in foundry.'
          ></ProjectComponent>
          <ProjectComponent
            name='Laravel Bookstore'
            skills='PHP | Laravel | Javascript'
            image={process.env.PUBLIC_URL + '/images/Wipaybookstore.png'}
            github='https://github.com/jourdanDunkley/WipayBookStore'
            description='This is a Laravel Application built to satisfy a backend developer challenge by Wipay. 
            This application is a web-based bookstore whose primary purpose is serving API requests.
            Due to the pandemic, foot traffic to a local bookstore has been diminished. This e-commerce 
            style web application was built in order to solve this problem. It is the intention that this 
            application will help drive sales and improve customer convenience.'
          ></ProjectComponent>    
        </div>
      </div>
    </div>
  )
}

export default ProjectScreen
