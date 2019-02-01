import { ContractWrappers, MetamaskSubprovider, RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { SignerSubprovider } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Content, Footer } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToastProvider, withToastManager } from 'react-toast-notifications';

import { Account } from './Account';
//import { Faucet } from './components/faucet';
//import { InstallMetamask } from './components/install_metamask';
//import { Nav } from './components/nav';
//import { Welcome } from './components/welcome';
import { ZeroExActions } from './zeroex_actions';
import { networkToRPCURI } from './0x/utils';



class Backend extends React.Component {
     
    constructor(props){
        super(props);
        this.initializeWeb3Async();
    }

    //async doBuy() {
    doBuy = async () => {
      console.log("doBuy()");
    }

 
    getAllTokens = async () => {
        console.log("getAllTokens()");
        const response = await fetch('https://api.radarrelay.com/v2/tokens');
        const myJson = await response.json(); 
        console.log(`Downloaded ${myJson.length} tokens`);
        console.log(`token[0]: ${JSON.stringify(myJson[0])}`);
      }


    toastTest = e => {
        console.log("attempting toast");
       /* const { toastManager } = this.props;
        toastManager.add('Saved Successfully', { appearance: 'success' });*/
    }


    render() {
        const AccountWithNotifications = withToastManager(Account);
        const ZeroExActionsWithNotifications = withToastManager(ZeroExActions);

        if (!this.state || !this.state.contractWrappers || !this.state.web3Wrapper) {
            return <div />;
        }

    return (
        <div>
            <Content className="container">
                    {this.state.web3 && (
                        <div>
                            <ToastProvider>
                               
                            <div>
                                <button class="btn btn-secondary" onClick={this.doBuy}>
                                TestTrade</button>
                            </div>

                            <div>
                                <button class="btn btn-secondary" onClick={this.getAllTokens}>
                                Get All Tokens</button>
                            </div>

                            <div>
                                <button class="btn btn-secondary" onClick={this.toastTest}>
                               Toast Test</button>
                            </div>


                            <ZeroExActionsWithNotifications
                                    contractWrappers={this.state.contractWrappers}
                                    web3Wrapper={this.state.web3Wrapper}
                                />

                            </ToastProvider>
                        </div>
                    )}
                </Content>
                <Footer/>
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