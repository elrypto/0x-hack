import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
    SignedOrder,
} from '0x.js';

import { Web3Wrapper } from '@0x/web3-wrapper';
import * as _ from 'lodash';
import * as React from 'react';

import { TOKENS, TOKENS_BY_NETWORK } from './tokens';
import { NULL_ADDRESS, ZERO, parseJSONSignedOrder } from './utils';
import { OpenModule } from './open_module';

import LittleCard from "../LittleCard";


const TraderSide = {
    MAKER: "MAKER",
    TAKER: "TAKER"
}

export class CreateAndExecuteMultiple extends React.Component{

    constructor(props) {
        super(props);
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
                    alloc_perc : "40",
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
                },
            ],
            purchaseTotal: 0
        }
    }


    handlePurchaseChange = e => {
        this.setState({purchaseTotal:e.target.value});
    }


    fillOrderAsync = async (signedOrder) => {
        const { web3Wrapper, contractWrappers } = this.props;
        // Query all available addresses
        const addresses = await web3Wrapper.getAvailableAddressesAsync();
        // Taker is the first address
        const takerAddress = addresses[0];
        const takerFillAmount = signedOrder.takerAssetAmount;
        // Call fillOrder on the Exchange contract
        const txHash = await contractWrappers.exchange.fillOrderAsync(signedOrder, takerFillAmount, takerAddress);
        return txHash;
    }


    createAndFillMultipleOrdersAsync = async()  => {
        console.log("CREATEANDFILL MULTIPLE");
      
        const {portfolio, purchaseTotal} = this.state;
        let makerAmount = '0';
        let makerTokenSymbol = '';
        const takerTokenSymbol = TOKENS.WETH.symbol;
        const takerAmount = '1';
        
        for (var i=0; i < portfolio.length; i++){
            // alloc_perc, turn it into a decimal e.g. 30%, becomes .3 
            makerAmount = purchaseTotal * ((portfolio[i].alloc_perc)/100);
            makerTokenSymbol = portfolio[i].token_symbol;
            console.log(`executing transaction for token #:${i+1} symbol:${makerTokenSymbol} for amount:${makerAmount}`);
            await this.createAndFillOrderAsync(makerTokenSymbol, makerAmount, takerTokenSymbol, takerAmount);
        }

        //go to my portfolios
        window.location = "/#/my_portfolio";
    }

    createAndFillOrderAsync = async(makerTokenSymbol, makerAmount, takerTokenSymbol, takerAmount)  => {
        console.log("create and fill for:" + makerTokenSymbol);
        //const { makerTokenSymbol, makerAmount, takerTokenSymbol, takerAmount } = this.state;
        const { web3Wrapper, contractWrappers } = this.props;
        // Query the available addresses
        const addresses = await web3Wrapper.getAvailableAddressesAsync();
        // Retrieve the network for the correct token addresses
        const networkId = await web3Wrapper.getNetworkIdAsync();
        // Use the first account as the maker
        const makerAddress = addresses[0];
        // Get the Token Metadata, address, decimals
        const tokensForNetwork = TOKENS_BY_NETWORK[networkId];
        const makerToken = tokensForNetwork[makerTokenSymbol];
        const takerToken = tokensForNetwork[takerTokenSymbol];
        // Encode the selected makerToken as assetData for 0x
        const makerAssetData = assetDataUtils.encodeERC20AssetData(makerToken.address);
        // Encode the selected takerToken as assetData for 0x
        const takerAssetData = assetDataUtils.encodeERC20AssetData(takerToken.address);
        // Amounts are in Unit amounts, 0x requires base units (as many tokens use decimals)
        const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(makerAmount), makerToken.decimals);
        const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(takerAmount), takerToken.decimals);
        const exchangeAddress = contractWrappers.exchange.address;
        // Create the order
       
        const order = {
            makerAddress, // maker is the first address
            takerAddress: NULL_ADDRESS, // taker is open and can be filled by anyone
            makerAssetAmount, // The maker asset amount
            takerAssetAmount, // The taker asset amount
            expirationTimeSeconds: new BigNumber(Date.now() + 10 * 60), // Time when this order expires
            makerFee: ZERO, // 0 maker fees
            takerFee: ZERO, // 0 taker fees
            feeRecipientAddress: NULL_ADDRESS, // No fee recipient
            senderAddress: NULL_ADDRESS, // Sender address is open and can be submitted by anyone
            salt: generatePseudoRandomSalt(), // Random value to provide uniqueness
            makerAssetData,
            takerAssetData,
            exchangeAddress,
        };

        // Generate the order hash for the order
        const orderHashHex = orderHashUtils.getOrderHashHex(order);

        //console.log(`order hash:${orderHashHex}`);

        const provider = web3Wrapper.getProvider();
        // The maker signs the order as a proof
        try {
            const signedOrder = await signatureUtils.ecSignOrderAsync(provider, order, makerAddress);
           
            console.log(`signed order:${JSON.stringify(signedOrder)}`);

            // Store the signed Order
            this.setState(prevState => ({ ...prevState, signedOrder, orderHash: orderHashHex }));
            
            //FILL
            const txHash = await this.fillOrderAsync(signedOrder);
            this.props.onTxSubmitted(txHash);
                    
            return signedOrder;
        } catch (err) {
            this.setState({ errorMessage: err.message });
            return null;
        }
    }

    render(){
        const {portfolio} = this.state;
//
        return(
            <div>

                <section class="jumbotron">
                    <p><small>Note: your puchase amount will be split across the tokens in this portfolio according
                        to the weight (allocation percentage) set by its creator. You may be required to sign and authorize purchases multiple times.
                    </small></p>
                    <label class="form-group">Purchase Amount:</label>
                    <input class="form-group" id="input_to_buy" type="text" onChange={this.handlePurchaseChange} value={this.state.purchaseTotal}/>

                    <button class="btn  btn-primary" onClick={this.createAndFillMultipleOrdersAsync}>
                    Purchase</button>

                    <button class="btn btn-secondary" onClick="">
                        Follow</button>
                </section>

                <LittleCard portfolio={portfolio} />
            </div>  
        );
    }

    
    fillOrderClick = async () => {
        const signedOrderJSON = this.state.signedOrder;
        if (signedOrderJSON) {
            const signedOrder = parseJSONSignedOrder(signedOrderJSON);
            const txHash = await this.fillOrderAsync(signedOrder);
            this.props.onTxSubmitted(txHash);
        }
    }
}
