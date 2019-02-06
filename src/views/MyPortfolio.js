import React, { Component } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { ContractWrappers, MetamaskSubprovider, RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { SignerSubprovider } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as _ from 'lodash';
import * as ReactDOM from 'react-dom';
import { ToastProvider, withToastManager } from 'react-toast-notifications';

import { Account } from './../components/Account';
import { networkToRPCURI } from './../components/0x/utils';



export default class MyPortfolio extends Component {

  constructor(props){
    super(props);
    this.initializeWeb3Async();
  }

  render() {
    const AccountWithNotifications = withToastManager(Account);
    
    if (!this.state || !this.state.contractWrappers || !this.state.web3Wrapper) {
      return <div />;
    }

    return (
      <div>
        <Header />
        
        <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          <ToastProvider>
              <AccountWithNotifications
                  erc20TokenWrapper={this.state.contractWrappers.erc20Token}
                  web3Wrapper={this.state.web3Wrapper}
                                  />
          </ToastProvider>  
        </div>

        <Footer />
    </div>
    );
  }

  async initializeWeb3Async(){
    let injectedProviderIfExists = (window).ethereum;
    if (!_.isUndefined(injectedProviderIfExists)) {
        if (!_.isUndefined(injectedProviderIfExists.enable)) {
            try {
                await injectedProviderIfExists.enable();
            } catch (err) {
                console.log(err);
            }
        }
    } else {
        const injectedWeb3IfExists = (window).web3;
        if (!_.isUndefined(injectedWeb3IfExists) && !_.isUndefined(injectedWeb3IfExists.currentProvider)) {
            injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
        } else {
            return undefined;
        }
    }
    if (injectedProviderIfExists) {
        // Wrap Metamask in a compatibility wrapper as some of the behaviour
        // differs
        const networkId = await new Web3Wrapper(injectedProviderIfExists).getNetworkIdAsync();
        const signerProvider =
            injectedProviderIfExists.isMetaMask || injectedProviderIfExists.isToshi
                ? new MetamaskSubprovider(injectedProviderIfExists)
                : new SignerSubprovider(injectedProviderIfExists);
        const provider = new Web3ProviderEngine();
        provider.addProvider(signerProvider);
        provider.addProvider(new RPCSubprovider(networkToRPCURI[networkId]));
        provider.start();
        const web3Wrapper = new Web3Wrapper(provider);
        const contractWrappers = new ContractWrappers(provider, { networkId });
        // Load all of the ABI's into the ABI decoder so logs are decoded
        // and human readable
        _.map(
            [
                contractWrappers.exchange.abi,
                contractWrappers.erc20Token.abi,
                contractWrappers.etherToken.abi,
                contractWrappers.forwarder.abi,
            ],
            abi => web3Wrapper.abiDecoder.addABI(abi),
        );
        this.setState({ web3Wrapper, contractWrappers, web3: injectedProviderIfExists });
    }
  }
}

