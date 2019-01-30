import React, { Component } from 'react';
import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
    ExchangeEvents,
} from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { NETWORK_CONFIGS, TX_DEFAULTS } from './0x/configs';
import { DECIMALS, NULL_ADDRESS, ZERO } from './0x/constants';
import { providerEngine } from './0x/provider_engine';
import { getRandomFutureDateInSeconds } from './0x/utils';

import { contractAddresses } from './0x/contracts';

class Backend extends Component {
     
    async doBuy() {
        console.log('starting buy order...');
        const contractWrappers = new ContractWrappers(providerEngine, {networkId: NETWORK_CONFIGS.networkId});
        // Initialize the Web3Wrapper, this provides helper functions around fetching
        // account information, balances, general contract logs
        const web3Wrapper = new Web3Wrapper(providerEngine);
        const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
        const zrxTokenAddress = contractAddresses.zrxToken;
        const etherTokenAddress = contractAddresses.etherToken;

        console.log("accounts maker:" + maker + ", taker:" + taker);

         // the amount the maker is selling of maker asset
     const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(5), DECIMALS);
     // the amount the maker wants of taker asset
     const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);
     // 0x v2 uses hex encoded asset data strings to encode all the information needed to identify an asset
     const makerAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
     const takerAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
     let txHash;
     let txReceipt;

      // Allow the 0x ERC20 Proxy to move ZRX on behalf of makerAccount
    const makerZRXApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
        zrxTokenAddress,
        maker,
    );

    console.log("maker 0x approval:" + makerZRXApprovalTxHash);

    // Allow the 0x ERC20 Proxy to move WETH on behalf of takerAccount
    const takerWETHApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
        etherTokenAddress,
        taker,
    );

    console.log("taker WETH Approval:" + takerWETHApprovalTxHash);

      // Set up the Order and fill it
      const randomExpiration = getRandomFutureDateInSeconds();
      const exchangeAddress = contractAddresses.exchange;
  

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
  
    console.log("...order filled");
  // Stop the Provider Engine
    providerEngine.stop();


    }

 
    
    /*
    <button
          className={classes.button}
          onClick={() => this.handleAlert(nos.getBalance({ asset: neo }))}
        >
        */
    
 /*   makeBuy = async func => () => {
        console.log("test Buy()");
    }*/

/*
    testTrade = e => {
        console.log('testTrade()');
        this.testBuy;
    }*/

    render() {
    return (
        <div>
            <button class="btn btn-secondary" onClick={this.doBuy}>
            TestTrade</button>
        </div>
    );
  }
}

export default Backend;
