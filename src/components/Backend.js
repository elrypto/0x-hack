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
import { NETWORK_CONFIGS, TX_DEFAULTS } from '../0x/configs';
import { DECIMALS, NULL_ADDRESS, ZERO } from '../0x/constants';
import { contractAddresses } from '../0x/contracts';
import { providerEngine } from '../0x/provider_engine';
import { getRandomFutureDateInSeconds } from '../0x/utils';


class Backend extends Component {
  
    testTrade = e => {
        console.log('testTrade()');
    }

    render() {
    return (
        <div>
            <button class="btn btn-secondary" onClick={this.testTrade}>
            TestTrade</button>
        </div>
    );
  }
}

export default Backend;
