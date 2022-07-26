import Navbar from '../components/Navbar';
import React from 'react';
import Moralis from 'moralis';
import { useMoralisCloudFunction, useMoralisWeb3Api, useMoralisQuery } from 'react-moralis';
import { useRef, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Fade from 'react-reveal/Fade'
import { Card, Image, Skeleton } from "antd";
import { SpinnerDotted } from 'spinners-react';
// import InvaderABI from '../artifacts/invaders.json';
// import MarketABI from '../artifacts/spacemarket.json';
// import SpaceABI from '../artifacts/space.json';
// import BoostABI from '../artifacts/boosts.json';
import InvaderABI from '../artifacts-polygon/invaders.json';
import MarketABI from '../artifacts-polygon/spacemarket.json';
import SpaceABI from '../artifacts-polygon/space.json';
import BoostABI from '../artifacts-polygon/boosts.json';
import spaceLaserImg from '../game/img/laser-blue-1.png';
import spaceLaserSound from '../game/sound/sfx-laser1.ogg';
import gameOverSound from '../game/sound/sfx-lose.ogg';
import spaceEnemyImg from '../game/img/enemy-blue-1.png';
import spaceEnemyLaserImg from '../game/img/laser-red-5.png';
import { BuyModal } from "../components/Modal/BuyModal";
import { DelistModal } from "../components/Modal/DelistModal";
import { ListModal } from "../components/Modal/ListModal";
import { BoostModal } from "../components/Modal/BoostModal";

const { Meta } = Card;

const GameScreen = () => {
  const KEY_CODE_LEFT = 37;
  const KEY_CODE_RIGHT = 39;
  const KEY_CODE_SPACE = 32;

  const PLAYER_MAX_SPEED = 600;
  const LASER_MAX_SPEED = 600;
  const LASER_COOLDOWN = 0.25;

  const PLAYER_WIDTH = 20;

  const ENEMIES_PER_ROW = 5;
  const ENEMY_HORIZONTAL_PADDING = 80;
  const ENEMY_VERTICAL_PADDING = 70;
  const ENEMY_VERTICAL_SPACING = 80;
  const ENEMY_COOLDOWN = 10.0;

  const game = useRef(null);
  const [gameStart, setGameStart] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [shortAddress, setShortAddress] = useState("");
  const [invader, setInvader] = useState("");
  const [score, setScore] = useState(0);
  
  const [allInvaders, setAllInvaders] = useState();
  const [allBoosts, setAllBoosts] = useState();
  const [listedItems, setListedItems] = useState([]);

  const [claimed, setClaimed] = useState(false);
  const [inventory, setInventory] = useState();
  const [spaceBalance, setSpaceBalance] = useState(0);

  const [approved, setApproved] = useState(false);
  const [spendApproved, setSpendApproved] = useState(false);
  const [boostSpendApproved, setBoostSpendApproved] = useState(false);

  const [nftToSell, setNftToSell] = useState(null);
  const [nftToBuy, setNftToBuy] = useState(null);
  const [nftToDelist, setNftToDelist] = useState(null);
  const [boostToMint, setBoostToMint] = useState(null);

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showDelistModal, setShowDelistModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);

  const [askingPrice, setAskingPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [balanceError, setBalanceError] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const [laserBoost, setLaserBoost] = useState(0);
  const [cooldownBoost, setCooldownBoost] = useState(0);
  const [moveBoost, setMoveBoost] = useState(0);

  const metadataPrefix = 'https://gateway.pinata.cloud/ipfs/QmY6Dt2tu9THDQiHo4BkquwgvUZRgPYJBg9urvSNyBmaVo/';
  const metadataExt = '.png';
  const boostmetadataPrefix = 'https://gateway.pinata.cloud/ipfs/QmVxCdTjBkznLKpm33byLBrm8HQ1kyVYXr8usctv7Tq2WS/';
  const boostMetadataExt = '.png';

  // const invadersContract = "0xfe12241Be4832A5f14B88398EF3FffBCCF6e9dE9";
  // const spaceMarketContract = "0x52784fccc36cef4d3b684a92dd3e86a680b4b74d";
  // const spaceContract = "0x33803B97F74397a3aE116693f577C58D9CC36d9A";
  // const boostContract = "0xF4Ce507688C107eF0078dCC6ed7df5342E68d9BA";

  const invadersContract = "0x36b09B9AC0b7494ecC3c66da5F9781B0D7B24f71";
  const spaceMarketContract = "0x6136BeC00Ba7C6d44BB10ee8683C792a0F8cDd6a";
  const spaceContract = "0xA1E217358E118A156446c02385591BB329194f82";
  const boostContract = "0xe84b3739A17339F25C64B4E68bC15FAc209b0ca2";

  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 400;
  
  const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    lasers: [],
    enemies: [],
    enemyLasers: [],
    gameOver: false,
    gameStart: false,
    playerAlive: true,
    initialized: false,
    score: 0,
  };

  /*--------------------------------------PLAYER-----------------------------------------*/
  
  function createPlayer($container) {
    GAME_STATE.playerX = GAME_WIDTH / 2;
    GAME_STATE.playerY = GAME_HEIGHT - 50;
    const $player = document.createElement("img");
    $player.src = invader;
    $player.className = 'player';
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
  }

  function updatePlayer(dt, $container) {
    if(GAME_STATE.leftPressed) {
      GAME_STATE.playerX -= dt*(PLAYER_MAX_SPEED + moveBoost);
    }
    if(GAME_STATE.rightPressed) {
      GAME_STATE.playerX += dt*(PLAYER_MAX_SPEED + moveBoost);
    }

    GAME_STATE.playerX = clamp(GAME_STATE.playerX, PLAYER_WIDTH, GAME_WIDTH - PLAYER_WIDTH);

    if(GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
      createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
      GAME_STATE.playerCooldown = LASER_COOLDOWN + cooldownBoost;
    }
    if(GAME_STATE.playerCooldown > 0) {
      GAME_STATE.playerCooldown -= dt;
    }

    const $player = document.querySelector('.player');
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
  }

  function destroyPlayer($container, player) {
    $container.removeChild(player);
    GAME_STATE.gameOver = true;
    GAME_STATE.playerAlive = false;
    setGameOver(true);
    const audio = new Audio(gameOverSound);
    audio.play();
  }

  /*--------------------------------------ENEMY-----------------------------------------*/

  function createEnemy($container, x, y) {
    const $element = document.createElement("img");
    $element.src = spaceEnemyImg;
    $element.className = "enemy";
    $container.appendChild($element);
    const enemy = {
      x,
      y,
      cooldown: rand(0.5, ENEMY_COOLDOWN),
      $element
    };
    GAME_STATE.enemies.push(enemy);
    setPosition($element, x, y);
  }

  function updateEnemies(dt, $container) {
    const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;
  
    const enemies = GAME_STATE.enemies;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const x = enemy.x + dx;
      const y = enemy.y + dy;
      setPosition(enemy.$element, x, y);
      enemy.cooldown -= dt;
      if (enemy.cooldown <= 0) {
        createEnemyLaser($container, x, y);
        enemy.cooldown = ENEMY_COOLDOWN;
      }
    }
    GAME_STATE.enemies = GAME_STATE.enemies.filter(e => !e.isDead);
  }

  function destroyEnemy($container, enemy) {
    $container.removeChild(enemy.$element);
    enemy.isDead = true;
    GAME_STATE.score++;
    setScore(GAME_STATE.score); 
  }

  /*--------------------------------------LASER-----------------------------------------*/

  function createLaser($container, x, y) {
    const $element = document.createElement('img');
    $element.src = spaceLaserImg;
    $element.className = 'laser';
    $container.appendChild($element);
    const laser = {x, y, $element};
    GAME_STATE.lasers.push(laser);
    setPosition($element, x, y);
    const audio = new Audio(spaceLaserSound);
    audio.play(); 
  }

  function updateLasers(dt, $container) {
    const lasers = GAME_STATE.lasers;
    for(let i = 0; i < lasers.length; i++) {
      const laser = lasers[i];
      laser.y -= dt * (LASER_MAX_SPEED + laserBoost);
      if(laser.y < 0) {
        destroyLaser($container, laser);
      }
      setPosition(laser.$element, laser.x, laser.y);
      const r1 = laser.$element.getBoundingClientRect();
      const enemies = GAME_STATE.enemies;
      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j];
        if (enemy.isDead) continue;
        const r2 = enemy.$element.getBoundingClientRect();
        if (rectsIntersect(r1, r2)) {
          // Enemy was hit
          destroyEnemy($container, enemy);
          destroyLaser($container, laser);
          break;
        }
      }
    }
    GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
  }

  function destroyLaser($container, laser) {
    $container.removeChild(laser.$element);
    laser.isDead = true;
  }

  /*--------------------------------------ENEMY LASER-----------------------------------------*/

  function createEnemyLaser($container, x, y) {
    const $element = document.createElement("img");
    $element.src = spaceEnemyLaserImg;
    $element.className = "enemy-laser";
    $container.appendChild($element);
    const laser = { x, y, $element };
    GAME_STATE.enemyLasers.push(laser);
    setPosition($element, x, y);
  }

  function updateEnemyLasers(dt, $container) {
    const lasers = GAME_STATE.enemyLasers;
    for (let i = 0; i < lasers.length; i++) {
      const laser = lasers[i];
      laser.y += dt * LASER_MAX_SPEED;
      if (laser.y > GAME_HEIGHT) {
        destroyLaser($container, laser);
      }
      setPosition(laser.$element, laser.x, laser.y);
      const r1 = laser.$element.getBoundingClientRect();
      const player = document.querySelector(".player");
      const r2 = player.getBoundingClientRect();
      if (rectsIntersect(r1, r2)) {
        // Player was hit
        destroyPlayer($container, player);
        break;
      }
    }
    GAME_STATE.enemyLasers = GAME_STATE.enemyLasers.filter(e => !e.isDead);
  }

  /*--------------------------------------UTILITIES----------------------------------------*/

  function playerHasWon() {
    return GAME_STATE.enemies.length === 0;
  }

  function clamp(v, min, max) {
    if(v < min) {
      return min;          
    } else if (v > max) {
      return max; 
    } else {
      return v;
    }
  }

  function rectsIntersect(r1, r2) {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    );
  }
  
  function setPosition($el, x, y) {
    $el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function rand(min, max) {
    if (min === undefined) min = 0;
    if (max === undefined) max = 1;
    return min + Math.random() * (max - min);
  }

  function init() {
    const $container = game.current;
    createPlayer($container);

    const enemySpacing = (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / (ENEMIES_PER_ROW - 1);
    for (let j = 0; j < 3; j++) {
      const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING;
      for (let i = 0; i < ENEMIES_PER_ROW; i++) {
        const x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING;
        createEnemy($container, x, y);
      }
    }
  }

  function onKeyDown(e) {
    if (e.keyCode === KEY_CODE_LEFT) {
      GAME_STATE.leftPressed = true;
    } else if (e.keyCode === KEY_CODE_RIGHT) {
      GAME_STATE.rightPressed = true;
    } else if (e.keyCode === KEY_CODE_SPACE) {
      GAME_STATE.spacePressed = true;
    }
  }
  function onKeyUp(e) {
    if (e.keyCode === KEY_CODE_LEFT) {
      GAME_STATE.leftPressed = false;
    } else if (e.keyCode === KEY_CODE_RIGHT) {
      GAME_STATE.rightPressed = false;
    } else if (e.keyCode === KEY_CODE_SPACE) {
      GAME_STATE.spacePressed = false;
    }
  } 

  function startGame() {
    document.querySelector(".game-over").style.display = "none";
    document.querySelector(".congratulations").style.display = "none";
    setGameStart(true);
    setGameOver(false);
    setInitialized(true);
    setScore(0);
    setClaimed(false);
    GAME_STATE.initialized = true;
  }

  function refresh(className) {
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function update() {
    const currentTime = Date.now();
    const dt = (currentTime - GAME_STATE.lastTime) / 1000;
    const $container = game.current;

    if (playerHasWon() && initialized && !gameOver) {
      document.querySelector(".congratulations").style.display = "flex";
      document.querySelector(".win-text").innerHTML = "You won the game!";

      refresh('enemy');
      refresh('player');
      refresh('laser');
      refresh('enemy-laser');
      setGameStart(false);
      return;
    }

    if(GAME_STATE.gameOver) {
      document.querySelector(".game-over").style.display = "block";
      refresh('enemy');
      refresh('player');
      refresh('laser');
      refresh('enemy-laser');
      setGameStart(false);
      return;
    }

    if(gameStart) {
      updatePlayer(dt, $container);
      updateLasers(dt, $container);
      updateEnemies(dt, $container);
      updateEnemyLasers(dt, $container);
    } 

    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
  }

  /*--------------------------------------WEB3-----------------------------------------*/

  const queryListings = useMoralisQuery('MarketItemCreated');
  const fetchListings = JSON.parse(
    JSON.stringify(queryListings.data, [
      "objectId",
      "createdAt",
      "price",
      "nftContract",
      "itemId",
      "sold",
      "forSale",
      "tokenId",
      "seller",
      "owner",
      "confirmed",
    ])
  )

  const { fetch } = useMoralisCloudFunction(
    "rewardMint",
    {
      account: walletAddress,
      amount: '15'
    },
  );

  const Web3API = useMoralisWeb3Api();

  const claimSpace = () => {
    if(!claimed) {
      setClaiming(true);
      document.querySelector(".win-text").innerHTML = "Claiming... Please Wait";
      fetch({
        onSuccess: (data) => {
          document.querySelector(".win-text").innerHTML = "+15 $SPACE Tokens! Congrats!";
          setClaimed(true);
          setClaiming(false);
        }
      })
    } else {
      document.querySelector(".win-text").innerHTML = "$SPACE Already Claimed This Round!";
    }
  }

  async function connectWallet() {
    if(typeof window.ethereum !== 'undefined') {  
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  async function requestAccount() {
    if(window.ethereum) {
      if(invader === '') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          setWalletAddress(accounts[0]);
          setShortAddress(accounts[0].substring(0, 6) + '...');
          await fetchListedNFTs();
          await fetchUserNFTS(accounts[0]);
          await fetchUserBoosts(accounts[0]);
          await isMarketplaceApproved(accounts[0]);
          await isBalanceApproved(accounts[0]);
          await isBoostBalanceApproved(accounts[0]);
          await getSpaceBalance(accounts[0]);
        } catch(e) {
          alert('No invader in your wallet. Please mint one to play');
        }
      }
    } else {
      alert('metamask not detected');
    }
  }

  async function fetchListedNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const invadersMarketplace = new ethers.Contract(spaceMarketContract, MarketABI.abi, provider.getSigner());

    const result = await invadersMarketplace.getListedItems();
    setListedItems(result);
  }

  const fetchUserNFTS = async (userAddress) => {
    const options = {
      chain: "mumbai",
      address: userAddress,
      token_address: invadersContract,
    };
    const userNFTs = await Moralis.Web3API.account.getNFTsForContract(options);
    setInventory(userNFTs);
  }

  const fetchUserBoosts = async (userAddress) => {
    const options = {
      chain: "mumbai",
      address: userAddress,
      token_address: boostContract,
    };
    const userNFTs = await Moralis.Web3API.account.getNFTsForContract(options);
    
    userNFTs?.result.map((nft) => {
      if(nft.token_id == 1) {
        const boost = parseInt(JSON.parse(nft.metadata).attributes[1].value);
        setLaserBoost(boost);
      }
      if(nft.token_id == 0) {
        const boost = parseInt(JSON.parse(nft.metadata).attributes[1].value);
        setMoveBoost(boost);
      }
      if(nft.token_id == 2) {
        const boost = parseFloat(JSON.parse(nft.metadata).attributes[1].value);
        setCooldownBoost(boost);  
      }
    });
  }

  async function isMarketplaceApproved(userAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const invaders = new ethers.Contract(invadersContract, InvaderABI.abi, provider.getSigner());
    const result = await invaders.isApprovedForAll(userAddress, spaceMarketContract);
    setApproved(result);
  }

  async function isBalanceApproved(userAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const space = new ethers.Contract(spaceContract, SpaceABI.abi, provider.getSigner());
    const result = await space.allowance(userAddress, spaceMarketContract);
    if(result != 0) {
      setSpendApproved(true);
    } else {
      setSpendApproved(false);
    }
  }

  async function isBoostBalanceApproved(userAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const space = new ethers.Contract(spaceContract, SpaceABI.abi, provider.getSigner());
    const result = await space.allowance(userAddress, boostContract);
    if(result != 0) {
      setBoostSpendApproved(true);
    } else {
      setBoostSpendApproved(false);
    }
  }

  async function getSpaceBalance(address) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const space = new ethers.Contract(spaceContract, SpaceABI.abi, provider.getSigner());
    const balance = await space.balanceOf(address);
    const parsedBalance = ethers.utils.formatEther(balance);
    setSpaceBalance(parsedBalance);
  }

  const getAllInvaders = async () => {
    const options = {
      chain: "mumbai",
      address: invadersContract,
    }
    const result = await Web3API.token.getAllTokenIds(options);
    return result;
  }

  const getAllBoosts = async () => {
    const options = {
      chain: "mumbai",
      address: boostContract,
    }
    const result = await Web3API.token.getAllTokenIds(options);
    return result;
  }

  async function publicMint() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const invaders = new ethers.Contract(invadersContract, InvaderABI.abi, provider.getSigner());

    if(walletAddress) {
      const hasClaimed = await invaders.publicClaimed(walletAddress);
      if( !hasClaimed ) {
        const mint = await invaders.publicMint();
        invaders.on('Transfer', async (from, to, id) => {
          if(from == ethers.constants.AddressZero && to.toLowerCase() == walletAddress.toLowerCase()){
            await requestAccount();
          } 
        });

      } else if(invader === '') {
        alert("You can only mint one invader per wallet!");
      }
    } else {
      alert("Please connect your wallet before trying to mint.");
    }
    
  }

  async function mintBoost(nft) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const boosts = new ethers.Contract(boostContract, BoostABI.abi, provider.getSigner());

    if(walletAddress) {
      setIsLoading(true);
      try {
        const mint = await boosts.mint(nft, 1);
      } catch (e) {
        setIsLoading(false);
      }
      boosts.on('TransferSingle', async (operator, from, to, id, amount) => {
        if(from == ethers.constants.AddressZero && to.toLowerCase() == walletAddress.toLowerCase()) {
          await requestAccount();
          setIsLoading(false);
          setShowBoostModal(false);
        }
      });
    } else {
      alert("Please connect your wallet before trying to mint.");
    }
    
  }

  async function list() {
    if(isNaN(askingPrice) || askingPrice <= 0) {
      setNumberError(true);
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const invadersMarketplace = new ethers.Contract(spaceMarketContract, MarketABI.abi, provider.getSigner());
    const listedItems = await invadersMarketplace.listedItems();
    setIsLoading(true);
    setNumberError(false);
    try {
      const listing = await invadersMarketplace.listNFT(invadersContract, nftToSell.token_id, ethers.utils.parseEther(askingPrice));     
    } catch (err) {
      setIsLoading(false);
    }
    invadersMarketplace.on('MarketItemCreated', async (itemId, nftContract, tokenId, seller, owner, price, sold, forSale) => {
      if(seller.toLowerCase() == walletAddress.toLowerCase() && 
      sold == false && 
      tokenId == nftToSell.token_id && 
      forSale == true &&
      itemId == parseInt(listedItems.toString()) + 1
      ) {
        setIsLoading(false);
        setShowListModal(false);
        await fetchListedNFTs();
      }
    });
  }

  async function delistInvader() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const invadersMarketplace = new ethers.Contract(spaceMarketContract, MarketABI.abi, provider.getSigner());

    setIsLoading(true);
    try {
      const listing = await invadersMarketplace.delistNFT(getContractItemId(nftToDelist));     
    } catch (err) {
      setIsLoading(false);
    }
    invadersMarketplace.on('MarketItemDelisted', async (itemId, owner) => {
      if(getContractItemId(nftToDelist).toString() == itemId.toString()) {
        setIsLoading(false);
        setShowDelistModal(false);
        await fetchListedNFTs();
      }
    });
  }

  async function buy() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const invadersMarketplace = new ethers.Contract(spaceMarketContract, MarketABI.abi, provider.getSigner());
    const space = new ethers.Contract(spaceContract, SpaceABI.abi, provider.getSigner());
    if(walletAddress) {
      const balance = await space.balanceOf(walletAddress);
      const parsedBalance = ethers.utils.formatEther(balance);
      if(parseFloat(parsedBalance) > parseFloat(getContractPrice(nftToBuy))){
        setIsLoading(true);
        try {
          const purchase = await invadersMarketplace.buyNFT(invadersContract, getContractItemId(nftToBuy));
        } catch(err) {
          setIsLoading(false);
        }
        invadersMarketplace.on('MarketItemSold', async (itemId, owner) => {
          if(getContractItemId(nftToBuy).toString() == itemId.toString()) {
            setIsLoading(false);
            setShowBuyModal(false);
            await fetchListedNFTs();
            await fetchUserNFTS(walletAddress);
            await getSpaceBalance(walletAddress);
          }
        });
      } else {
        setBalanceError(true);
      }
    } else {
      alert("Please connect wallet before trying to buy.");
    }
  }

  async function approveInvaders() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const invaders = new ethers.Contract(invadersContract, InvaderABI.abi, provider.getSigner());

    setIsLoading(true);
    const approval = await invaders.setApprovalForAll(spaceMarketContract, true);
    invaders.on('ApprovalForAll', async (owner, operator, approved) => {
      if(owner.toLowerCase() == walletAddress.toLowerCase()) {
        setApproved(true);
        setIsLoading(false);
      }
    });
  }
  async function approveBalanceSpend() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const space = new ethers.Contract(spaceContract, SpaceABI.abi, provider.getSigner());
    
    setIsLoading(true);
    const result = await space.approve(spaceMarketContract, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    space.on('Approval', async (owner, spender, amount) => {
      if(owner.toLowerCase() == walletAddress.toLowerCase()) {
        setSpendApproved(true);
        setIsLoading(false);
      }
    })
  }

  async function approveBoostBalanceSpend() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const space = new ethers.Contract(spaceContract, SpaceABI.abi, provider.getSigner());
    
    setIsLoading(true);
    const result = await space.approve(boostContract, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    space.on('Approval', async (owner, spender, amount) => {
      if(owner.toLowerCase() == walletAddress.toLowerCase()) {
        setBoostSpendApproved(true);
        setIsLoading(false);
      }
    })
  }

  const isNFTListed = (nft) => {
    const result = listedItems?.find(
      (e) => {
        return e[2].toString() === nft?.token_id.toString() && e.forSale === true
      }
    );
    return result;
  }

  const getContractPrice = (nft) => {
    const result = listedItems.find(
      (e) => {
        return e[2].toString() === nft?.token_id.toString()
      }
    )
    if(result){
      return ethers.utils.formatEther(result?.price);
    }
  }

  const getContractItemId = (nft) => {
    if(!nft) return;
    const result = listedItems.find(
      (e) => {
        return e[2].toString() === nft?.token_id.toString()
      }
    )
    if(result){
      return result?.itemId;
    }
  }

  const handleListClick = (nft) => {
    setNftToSell(nft);
    setShowListModal(true);
  };

  const handleDeListClick = (nft) => {
    setNftToDelist(nft);
    setShowDelistModal(true);
  };

  const handleBoostClick = (nft) => {
    setBoostToMint(nft);
    setShowBoostModal(true);
  };

  const handleBuyClick = (nft) => {
    setNftToBuy(nft);
    setShowBuyModal(true);
  };

  /*--------------------------------------USEEFFECT----------------------------------------*/

  useEffect(() => {
    if(invader) startGame();
  }, [invader]);

  useEffect(() => {
    if(gameStart){
      init();
    }

    const fetchInvaders = async () => {
      const invaders = await getAllInvaders();
      const boosts = await getAllBoosts();
      setAllInvaders(invaders);
      setAllBoosts(boosts);
    }

    fetchInvaders();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.requestAnimationFrame(update);

  }, [gameStart])



  return (
    <div className='main-screen'>
      <Navbar active='Game'></Navbar>
      <div className='screen-body'>
        <div className="wrap">
          <Fade left>
            <div className='game-instructions'>
              <h2 style={{ color: '#6C63FF' }}>Blockchain</h2> &nbsp;
              <h2 style={{ color: 'white' }}>Invaders!</h2>
              <h3 style={{ color: 'white' }}>How To Play:</h3>
              <p>
                1. Switch your metamask wallet to Mumbai Testnet. <a href='https://blog.pods.finance/guide-connecting-mumbai-testnet-to-your-metamask-87978071aca8' target="_blank">GUIDE</a>  <br/>
                2. Get some Mumbai Test Matic from <a href='https://faucet.polygon.technology/' target="_blank">HERE</a>  <br/>
                3. Connect Your Wallet. <br/>
                4. Mint Your Invader. <br/>
                5. Eliminate All Enemies. Dont get hit! <br/>
                6. Claim Your Reward. <br/>               
                7. Buy more Invaders in the marketplace or mint special upgrades with your SPACE tokens. <br/>               
              </p>
              <button style={{ width: '50%' }} onClick={ connectWallet }>CONNECT</button>
              <button style={{ width: '50%' }} onClick={ publicMint }>MINT</button>
            </div>
          </Fade>
          <div className="game-wrapper">
            <div className="game" ref={game}>
              <p className="player-address">Player: {shortAddress}</p>
              <p className="player-score">Score: {score}</p>
            </div>
            <div className="congratulations">
              <h1>Congratulations!</h1>
              <p className='win-text'>You won the game!</p>
              <SpinnerDotted 
                enabled={claiming && !claimed} 
                color={'#6C63FF'} 
                style={{marginBottom:'10px'}} 
                size={35}
                />
              <button className="dialog-button" onClick={ startGame } disabled={claiming}>RESTART</button>
              <button className="dialog-button" onClick={() => claimSpace() } disabled={claiming}>CLAIM</button>
            </div>
            <div className="game-over">
              <h1>GAME OVER</h1>
              <h2 style={{color: 'white'}}>You lost the game</h2>
              <button className="dialog-button" onClick={ startGame }>RESTART</button>
            </div>
            <div className="game-start" style={{ display: walletAddress ? 'none' : 'block' }}>
              <h1>CONNECT WALLET TO BEGIN</h1>
            </div>
            <div className="play-on-desktop">
              <h1>PLAY ON DESKTOP!</h1>
            </div>
            <div className="game-start" style={{ display: walletAddress && !(gameStart || initialized) ? 'flex' : 'none' }}>
              <h1>SELECT YOUR INVADER</h1>
              <div className='invader-group'>
                {inventory?.result && inventory.result.map((nft, index) => (
                  <Card
                    hoverable           
                    className='invader-select'
                    onClick={() => setInvader(metadataPrefix + nft.token_id + metadataExt)}
                    cover={
                      <Image
                        preview={false}
                        src={metadataPrefix + nft.token_id + metadataExt || "error"}
                        fallback="data:image/png;base64,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"
                        alt=""
                        style={{ width: '40px' }}
                      />
                    } 
                    key={index}
                  >
                    <Meta style={{fontWeight: 'bolder'}} description={`Invader #${nft.token_id}`} />
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <Fade right>
            <div className='game-instructions'>
              <h2 style={{ color: '#6C63FF' }}>About</h2> &nbsp;
              <p>
                Blockchain Invaders is a game that demonstrates the power of Web3 in gaming.
                Through the use of NFT technology, gamers are given complete ownership 
                over their in-game assets in the form of NFTs. This means you can buy, sell or gift
                your in-game assets in a fully decentralized manner. <br/> <br/>

                When you mint your invader, you are given a digital asset that 
                can be used within Blockchain Invaders. No one else owns your particular invader,
                and no one else can use your particular invader - unless you transfer it to them. <br/><br/>

                <span style={{fontWeight:'bolder', color: '#6C63FF'}}>
                  Add the token contract 0xA1E217358E118A156446c02385591BB329194f82 to your wallet to view your reward.
                </span>
              </p>
            </div>
          </Fade>
        </div>
        <div className='tab-container'>
          <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
          >
            Market
          </button>
          <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
          >
            Inventory
          </button>
          <button
            className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(3)}
          >
            Boosts
          </button>
        </div>

        <div className='market-wrapper' style={{ display: toggleState === 1 ? 'flex' : 'none' }}>
          <h1 style={{ color: '#6C63FF' }}>Space Marketplace</h1>
          <p style={{ color: '#6C63FF' }}>$SPACE Balance: {spaceBalance}</p>
          <div className='nft-list'>
            <Skeleton loading = {!allInvaders?.result}>
              {allInvaders?.result && allInvaders.result.map((nft, index) => (
                <Card
                  hoverable           
                  className='nft-card'  
                  cover={
                    <Image
                      preview={false}
                      src={metadataPrefix + nft.token_id + metadataExt || "error"}
                      fallback="data:image/png;base64,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"
                      alt=""
                      style={{ width: '100px' }}
                    />
                  } 
                  key={index}
                >
                  { isNFTListed(nft) ? 
                    <>
                      <Meta className='nft-description' description={`Price: ${getContractPrice(nft)} SPACE`} /> 
                      <Meta className='nft-description' description={`Invader #${nft.token_id}`} />
                      <button onClick={() => handleBuyClick(nft)}>BUY NOW</button>
                    </>   
                    : 
                    <>
                      <Meta className='nft-description' description={`Invader #${nft.token_id}`} />
                      <button style={{ cursor:'auto' }}>NOT LISTED</button>
                    </>
                  }
                </Card>
              ))}
            </Skeleton>
          </div>
        </div>
        
        <div className='my-inventory' style={{ display: toggleState === 2 ? 'flex' : 'none' }}>
          <h1 style={{ color: '#6C63FF' }}>Inventory</h1>
          <div className='nft-list'>
            <Skeleton loading = {!inventory?.result}>
              {inventory?.result && inventory.result.map((nft, index) => (
                <Card
                  hoverable           
                  className='nft-card'
                
                  cover={
                    <Image
                      preview={false}
                      src={metadataPrefix + nft.token_id + metadataExt || "error"}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                      alt=""
                      style={{ width: '100px' }}
                    />
                  } 
                  key={index}
                >
                  <Meta className='nft-description' description={`Invader #${nft.token_id}`} />
                  { isNFTListed(nft) ?
                    <button onClick={() => handleDeListClick(nft)}>DELIST</button> :
                    <button onClick={() => handleListClick(nft)}>SELL</button>
                  }
                  
                </Card>
              ))}
            </Skeleton>
          </div>
        </div>

        <div className='boosts' style={{ display: toggleState === 3 ? 'flex' : 'none' }}>
          <h1 style={{ color: '#6C63FF' }}>Boosts</h1>
          <div className='nft-list'>
            <Skeleton loading = {!allBoosts?.result}>
              {allBoosts?.result && allBoosts.result.map((nft, index) => (
                <Card
                  hoverable           
                  className='nft-card'  
                  cover={
                    <Image
                      preview={false}
                      src={boostmetadataPrefix + nft.token_id + boostMetadataExt || "error"}
                      fallback="data:image/png;base64,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"
                      alt=""
                      style={{ width: '60px', height: '80px' }}
                    />
                  } 
                  key={index}
                >
                  <Meta className='nft-description' description={`PRICE: 15 SPACE`} />
                  <Meta style={{ color: '#6C63FF' }} className='nft-description' description={JSON.parse(nft.metadata).attributes[0].value} />
                  <Meta style={{ color: '#6C63FF' }} className='nft-description' description={`${JSON.parse(nft.metadata).attributes[1].trait_type} : ${JSON.parse(nft.metadata).attributes[1].value}`} />
                  <button onClick={() => handleBoostClick(nft)}>MINT</button>
                </Card>
              ))}
            </Skeleton>
          </div>
        </div>
      </div>
      <BuyModal 
        showModal={showBuyModal} 
        setShowModal={setShowBuyModal} 
        buy={buy}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        listModal={false} 
        nftImg={metadataPrefix + nftToBuy?.token_id + metadataExt}
        price={getContractPrice(nftToBuy)}  
        balanceError={balanceError}
        setBalanceError={setBalanceError}
        spendApproved={spendApproved}
        approveBalanceSpend={approveBalanceSpend}
      /> 
      <ListModal 
        showModal={showListModal} 
        setShowModal={setShowListModal}
        setAskingPrice={setAskingPrice} 
        approveInvaders={approveInvaders}
        list={list}
        approved={approved}
        nftImg={metadataPrefix + nftToSell?.token_id + metadataExt}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        numberError={numberError}
        setNumberError={setNumberError}
      /> 
      <DelistModal 
        showModal={showDelistModal} 
        setShowModal={setShowDelistModal}
        nftImg={metadataPrefix + nftToDelist?.token_id + metadataExt}
        isLoading={isLoading}
        delistInvader={delistInvader}
      /> 
      <BoostModal 
        showModal={showBoostModal} 
        setShowModal={setShowBoostModal} 
        mintBoost={mintBoost}
        boost={boostToMint?.token_id}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        nftImg={boostmetadataPrefix + boostToMint?.token_id + boostMetadataExt}
        balanceError={balanceError}
        setBalanceError={setBalanceError}
        boostSpendApproved={boostSpendApproved}
        approveBoostBalanceSpend={approveBoostBalanceSpend}
      /> 
    </div>
  )
}

export default GameScreen
