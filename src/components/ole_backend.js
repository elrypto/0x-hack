import React, { Component } from 'react';
import {
    assetDataUtils,
    BigNumber,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
    ExchangeEvents,
} from '0x.js';
import { ContractWrappers, MetamaskSubprovider, RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { SignerSubprovider } from '@0x/subproviders';
import * as _ from 'lodash';

import { Web3Wrapper } from '@0x/web3-wrapper';

import { NETWORK_CONFIGS, TX_DEFAULTS } from './0x/configs';
import { DECIMALS, NULL_ADDRESS, ZERO } from './0x/constants';
import { contractAddresses } from './0x/contracts';
import { providerEngine } from './0x/provider_engine';
import { getRandomFutureDateInSeconds } from './0x/utils';



class Backend extends Component {
     
    //async doBuy() {
    doBuy = async () => {
       try{
            console.log('starting buy order...');
            const contractWrappers = new ContractWrappers(providerEngine, {networkId: NETWORK_CONFIGS.networkId});
            // Initialize the Web3Wrapper, this provides helper functions around fetching
            // account information, balances, general contract logs
            const web3Wrapper = new Web3Wrapper(providerEngine);
            const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync()
            const zrxTokenAddress = contractAddresses.zrxToken;
            const etherTokenAddress = contractAddresses.etherToken;

            
            console.log("accounts maker:" + maker + ", taker:" + taker);
            console.log("token addresses: zrx" + zrxTokenAddress + ", weth=" + etherTokenAddress);

            // the amount the maker is selling of maker asset
            const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(5), DECIMALS);
            // the amount the maker wants of taker asset
            const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);
            // 0x v2 uses hex encoded asset data strings to encode all the information needed to identify an asset
            const makerAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
            const takerAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
            let txHash;
            let txReceipt;


            console.log("makerAssetData=" + JSON.stringify(makerAssetData));
            console.log("takerAssetData=" + JSON.stringify(takerAssetData));
            console.log("maker amount:" + makerAssetAmount);
            console.log("taker amount:" + takerAssetAmount);


            // Allow the 0x ERC20 Proxy to move ZRX on behalf of makerAccount
            const makerZRXApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
                zrxTokenAddress,
                maker,
            );

            
            // Allow the 0x ERC20 Proxy to move WETH on behalf of takerAccount
            const takerWETHApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
                etherTokenAddress,
                taker,
            );

            console.log("maker 0x approval:" + makerZRXApprovalTxHash);
            console.log("taker WETH Approval:" + takerWETHApprovalTxHash);


            // Set up the Order and fill it
            const randomExpiration = getRandomFutureDateInSeconds();
            const exchangeAddress = contractAddresses.exchange;
        
            console.log("exchange address:" + exchangeAddress);


            // Create the order
            const order = {
                exchangeAddress,
                makerAddress: maker,
                takerAddress: NULL_ADDRESS,
                senderAddress: NULL_ADDRESS,
                feeRecipientAddress: NULL_ADDRESS,
                expirationTimeSeconds: randomExpiration,
                salt: generatePseudoRandomSalt(),
                makerAssetAmount,
                takerAssetAmount,
                makerAssetData,
                takerAssetData,
                makerFee: ZERO,
                takerFee: ZERO,
            };


            console.log("creating order...");
            console.log(JSON.stringify(order));


            // Generate the order hash and sign it
            const orderHashHex = orderHashUtils.getOrderHashHex(order);
            const signature = await signatureUtils.ecSignHashAsync(providerEngine, orderHashHex, maker);
            const signedOrder = { ...order, signature };

           // Validate the order is Fillable before calling fillOrder
            // This checks both the maker and taker balances and allowances to ensure it is fillable
            // up to takerAssetAmount
            await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, takerAssetAmount, taker);

            // Fill the Order via 0x Exchange contract
            txHash = await contractWrappers.exchange.fillOrderAsync(signedOrder, takerAssetAmount, taker, {
                gasLimit: TX_DEFAULTS.gas,
            });
    
            console.log("...order filled, with hash:" + txHash);
            // Stop the Provider Engine
            providerEngine.stop();

        } catch (e) {
            console.error("ERROR occured during txn");
            console.log(e);
            providerEngine.stop();
        }
    }

 
    getAllTokens = async () => {
        console.log("getAllTokens()");
        const response = await fetch('https://api.radarrelay.com/v2/tokens');
        const myJson = await response.json(); 
        console.log(`Downloaded ${myJson.length} tokens`);
      }


  

    render() {
    return (
        <div>
            <div>
                <button class="btn btn-secondary" onClick={this.doBuy}>
                TestTrade</button>
            </div>

            <div>
                <button class="btn btn-secondary" onClick={this.getAllTokens}>
                Get All Tokens</button>
            </div>
        </div>
    );
  }
}

export default Backend;


/* Meta Mask Web3 Provider

import { SignerSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';

// Create a Web3 Provider Engine
const providerEngine = new Web3ProviderEngine();
// Compose our Providers, order matters
// Use the SignerSubprovider to wrap the browser extension wallet
// All account based and signing requests will go through the SignerSubprovider
providerEngine.addProvider(new SignerSubprovider(window.web3.currentProvider));
// Use an RPC provider to route all other requests
providerEngine.addProvider(new RPCSubprovider('http://localhost:8545'));
providerEngine.start();

(async () => {
    // Get all of the accounts through the Web3Wrapper
    const web3Wrapper = new Web3Wrapper(providerEngine);
    const accounts = await web3Wrapper.getAvailableAddressesAsync();
    console.log(accounts);
})();

*/