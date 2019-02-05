import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToastProvider, withToastManager } from 'react-toast-notifications';
import { ContractWrappers, MetamaskSubprovider, RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { SignerSubprovider } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { networkToRPCURI } from '../components/0x/utils';

import Header from './../components/Header';
import Footer from './../components/Footer';
import LittleCard from './../components/LittleCard';





class Follow extends React.Component {
     
    constructor(props){
        super(props);
        this.initializeWeb3Async();

         /* TODO:
                1. portfolio would be pulled from remote distributed storage (e.g. IPFS) linked to 
                the user (i.e. RaSpUtAn)
                2. token definitons pulled from a remote source 
                3. Attempt to switch to MultiAssetProxy to have only one signing step
            */

        this.state = {      
            portfolio : [
                {
                    token_icon : "https://0xproject.com/images/token_icons/ZRX.png",
                    token_symbol : "ZRX",
                    token_name : "0x Protocol Token",
                    alloc_perc : "30",
                    more_info : "http://0x.org"
                },
                {
                    token_icon : "https://0xproject.com/images/token_icons/MKR.png",
                    token_symbol : "MKR",
                    token_name : "Maker DAO",
                    alloc_perc : "15",
                    more_info : "https://makerdao.com"
                },
                {
                    token_icon : "https://0xproject.com/images/token_icons/GNT.png",
                    token_symbol : "GNT",
                    token_name : "Golem Network Token",
                    alloc_perc : "15",
                    more_info : "https://golem.network/"
                },
                {
                    token_icon : "https://0xproject.com/images/token_icons/REP.png",
                    token_symbol : "REP",
                    token_name : "Augur Reputation Token",
                    alloc_perc : "30",
                    more_info : "https://www.augur.net/"
                }
            ]
        }
    }

    render() {
       // const ZeroExActionsWithNotifications = withToastManager(ZeroExMultiBuyAction);


        //if (!this.state || !this.state.contractWrappers || !this.state.web3Wrapper) {
        //    return <div />;
        //}

        const {portfolio} = this.state;

        return (
            <div>
                  <Header />

                  <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                  <p class="lead">Click <strong>follow</strong> to be notified of when RaSpUtAn makes trading moves with
                   this portfolio and click <strong>purchase</strong> to mirror RaSpUtAn's most recent  portfolio allocation.
                   You can match the next trade (or not), move this allocation to match another trader, or cash out to Eth at any time.
                   Also, you can try the risk free simulation tool - everything is the same, except you are not using real tokens.
                   </p>

                   
                   <LittleCard portfolio={portfolio} />

                   <button class="btn  btn-primary" onClick="">
                        Purchase</button>
                   <button class="btn btn-secondary" onClick="">
                        Follow</button>

                  </div>

                  <Footer />
            </div>          
        )
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

export default Follow;

