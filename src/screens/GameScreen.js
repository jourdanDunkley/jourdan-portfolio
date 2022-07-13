import Navbar from '../components/Navbar';
import React from 'react';
import { useRef, useEffect, useState } from 'react';
import spaceCraftImg from '../game/img/player-blue-1.png';
import spaceLaserImg from '../game/img/laser-blue-1.png';
import spaceLaserSound from '../game/sound/sfx-laser1.ogg';
import gameOverSound from '../game/sound/sfx-lose.ogg';
import spaceEnemyImg from '../game/img/enemy-blue-1.png';
import spaceEnemyLaserImg from '../game/img/laser-red-5.png';
import { ethers } from 'ethers';
import Fade from 'react-reveal/Fade'
import InvaderABI from '../artifacts/invaders.json';
import Moralis from 'moralis';
import { createLogger } from 'redux-logger';


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

  const metadataPrefix = 'https://gateway.pinata.cloud/ipfs/QmY6Dt2tu9THDQiHo4BkquwgvUZRgPYJBg9urvSNyBmaVo/';
  const metadataExt = '.png';

  const game = useRef(null);
  const [gameStart, setGameStart] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [invader, setInvader] = useState("");

  const invadersContract = "0xfe12241Be4832A5f14B88398EF3FffBCCF6e9dE9";
  
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
  };

  /*--------------------------------------WEB3-----------------------------------------*/

  async function requestAccount() {
    if(window.ethereum) {
      if(invader === '') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          })
          console.log('request account');
          console.log(ethers.constants.HashZero);
          setWalletAddress(accounts[0]);
          await fetchUserNFTS(accounts[0]);
        } catch(e) {
          console.log(e);
          alert('No invader in your wallet. Please mint one to play');
        }
      }
    } else {
      alert('metamask not detected');
    }
  }

  const fetchUserNFTS = async (userAddress) => {
    const options = {
      chain: "rinkeby",
      address: userAddress,
      token_address: invadersContract,
    };
    const userNFTs = await Moralis.Web3API.account.getNFTsForContract(options);
    console.log('fetch user nfts');
    setInvader(metadataPrefix + userNFTs.result[0].token_id + metadataExt);
  }

  useEffect(() => {
    if(invader) startGame();
    console.log('start game');
  }, [invader]);

  async function connectWallet() {
    if(typeof window.ethereum !== 'undefined') {  
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  async function publicMint() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const invaders = new ethers.Contract(invadersContract, InvaderABI.abi, provider.getSigner());

    if(walletAddress) {
      const hasClaimed = await invaders.publicClaimed(walletAddress);
      console.log(hasClaimed);
      if( !hasClaimed ) {
        const mint = await invaders.publicMint();
        console.log(mint);
        invaders.on('Transfer', async (from, to, id) => {
          if(from == ethers.constants.AddressZero && to.toLowerCase() == walletAddress.toLowerCase()){
            console.log('SUCCESSFUL MINT');
            console.log(from);
            console.log(ethers.constants.AddressZero);
            console.log(to);
            console.log(walletAddress.toLowerCase());
            console.log(id);
            await requestAccount();
          } else {
            console.log('UNSUCCESSFUL MINT');
            console.log(from);
            console.log(ethers.constants.AddressZero);
            console.log(to);
            console.log(walletAddress.toLowerCase());
            console.log(id);
          }
        });

      } else if(invader === '') {
        alert("You can only mint one invader per wallet!");
      }
    } else {
      alert("Please connect your wallet before trying to mint.");
    }
    
  }

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
      GAME_STATE.playerX -= dt*PLAYER_MAX_SPEED;
    }
    if(GAME_STATE.rightPressed) {
      GAME_STATE.playerX += dt*PLAYER_MAX_SPEED;
    }

    GAME_STATE.playerX = clamp(GAME_STATE.playerX, PLAYER_WIDTH, GAME_WIDTH - PLAYER_WIDTH);

    if(GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
      createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
      GAME_STATE.playerCooldown = LASER_COOLDOWN;
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
    // console.log(`playerHasWon: ${playerHasWon()}`);
    // console.log(`enemy count: ${GAME_STATE.enemies.length}`);
    // console.log(`initialized: ${initialized}`);
    // console.log(`GAME_STATE.gameOver: ${GAME_STATE.gameOver}`);
    // console.log(`GAME_STATE.player alive: ${GAME_STATE.playerAlive}`);
    // console.log(`GAME_STATE.initialized: ${GAME_STATE.initialized}`);

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
      laser.y -= dt * LASER_MAX_SPEED;
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
    GAME_STATE.initialized = true;
    // setEnemiesOnScreen(true);
  }

  function update() {
    const currentTime = Date.now();
    const dt = (currentTime - GAME_STATE.lastTime) / 1000;
    const $container = game.current;

    if (playerHasWon() && initialized && !gameOver) {
      document.querySelector(".congratulations").style.display = "block";

      console.log(`playerHasWon: ${playerHasWon()}`);
      console.log(`initialized: ${initialized}`);
      console.log(`GAME_STATE.gameOver: ${GAME_STATE.gameOver}`);
      console.log(`GAME_STATE.playerAlive: ${GAME_STATE.playerAlive}`);
      console.log(`GAME_STATE.initialized: ${GAME_STATE.initialized}`);

      document.querySelector(".game").innerHTML = "";
      setGameStart(false);
      return;
    }

    if(GAME_STATE.gameOver) {
      console.log(`playerHasWon: ${playerHasWon()}`);
      console.log(`initialized: ${initialized}`);
      console.log(`GAME_STATE.gameOver: ${GAME_STATE.gameOver}`);
      console.log(`GAME_STATE.playeralive: ${GAME_STATE.playerAlive}`);
      console.log(`GAME_STATE.initialized: ${GAME_STATE.initialized}`);


      document.querySelector(".game-over").style.display = "block";
      document.querySelector(".game").innerHTML = "";
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

  useEffect(() => {
    if(gameStart){
      init();
    }
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
                1. Switch your metamask wallet to Rinkeby Testnet. <br/>
                2. Get some Rinkeby Test Ether from <a href='https://faucets.chain.link/rinkeby'>here</a>  <br/>
                3. Connect Your Wallet. <br/>
                4. Mint Your Invader. <br/>
                5. Eliminate All Enemies. Dont get hit! <br/>
                6. Claim Your Reward. <br/>
              </p>
              <button style={{ width: '50%' }} onClick={ connectWallet }>CONNECT</button>
              <button style={{ width: '50%' }} onClick={ publicMint }>MINT</button>
            </div>
          </Fade>
          <div className="game-wrapper">
            <div className="game" ref={game}></div>
            <p className="player-address">Player: {walletAddress}</p>
            
            <div className="congratulations">
              <h1>Congratulations!</h1>
              <h2>You won the game</h2>
              <button className="btn" onClick={ startGame }>RESTART</button>
            </div>
            <div className="game-over">
              <h1>GAME OVER</h1>
              <h2>You lost the game</h2>
              <button className="btn" onClick={ startGame }>RESTART</button>
            </div>
            <div className="game-start" style={{ display: gameStart || initialized ? 'none' : 'block' }}>
              <h1>CONNECT WALLET TO BEGIN</h1>
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
                and no one else can use your particular invader - unless you transfer it to them.
              </p>
            </div>
          </Fade>
          {/* <Fade right>
            <div className='mint-container'>
              <h2>MINT</h2>
              <p>1/12</p>
              <button style={{ width: '50%' }}>MINT</button>
            </div>
          </Fade> */}
        </div>
        
      </div>
    </div>
  )
}

export default GameScreen
