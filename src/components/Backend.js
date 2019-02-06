import { ContractWrappers, MetamaskSubprovider, RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { SignerSubprovider } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Content, Footer } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';
import { ToastProvider, withToastManager } from 'react-toast-notifications';

import { Account } from './Account';
import { ZeroExMultiBuyAction } from './zero_ex_multi_buy_action';
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
        const ZeroExActionsWithNotifications = withToastManager(ZeroExMultiBuyAction);

        if (!this.state || !this.state.contractWrappers || !this.state.web3Wrapper) {
            return <div />;
        }

    return (
        <div>
 
                    {this.state.web3 && (
                        <div>
                            <ToastProvider>
                               
                            <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                                <p class="lead">Click <strong>follow</strong> to be notified of when RaSpUtAn makes trading moves with
                                this portfolio and click <strong>purchase</strong> to mirror RaSpUtAn's most recent  portfolio allocation.
                                You can match the next trade (or not), move this allocation to match another trader, or cash out to Eth at any time.
                                Also, you can try the risk free simulation tool - everything is the same, except you are not using real tokens.
                                </p>

                                <ZeroExActionsWithNotifications
                                        contractWrappers={this.state.contractWrappers}
                                        web3Wrapper={this.state.web3Wrapper}
                                    />

                            </div>
                            </ToastProvider>

                        </div>
                    )}
                
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
