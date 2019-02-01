import { ContractWrappers, SignedOrder } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Button, PanelBlock, TextArea } from 'bloomer';
import * as React from 'react';

import { parseJSONSignedOrder } from './utils';
import { OpenModule } from './open_module';
import { PanelBlockField } from './panel_block_field';



export class FillOrder extends React.Component {

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

    render() {
        return (
            <div>
                <PanelBlock>
                    <div>
                        Orders are filled when a taker submits them to the blockchain. This example executes a
                        fillOrder, filling the entire amount of the order.
                        <OpenModule filePath="/src/components/zeroex_actions/fill_order.tsx" lineNumber={20} />
                    </div>
                </PanelBlock>
                <PanelBlockField label="Order">
                    <TextArea
                        type="text"
                        placeholder="Order"
                        onChange={e => {
                            const value = (e.target).value;
                            this.setState(prev => ({ ...prev, signedOrder: value }));
                        }}
                    />
                </PanelBlockField>
                <PanelBlock>
                    <Button
                        onClick={this.fillOrderClick.bind(this)}
                        isFullWidth={true}
                        isSize="small"
                        isColor="primary"
                    >
                        Fill Order
                    </Button>
                </PanelBlock>
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
