import { ContractWrappers } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Column, Columns, Content, Panel, PanelTabs, Subtitle } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';

import { CancelOrder } from './0x/cancel_order';
import { CreateOrder } from './0x/create_order';
import { FillOrder } from './0x/fill_order';
import { GetOrderInfo } from './0x/order_info';
import { WrapEth } from './0x/wrap_eth';

import { CreateAndExecuteMultiple } from './0x/create_and_execute_multiple';


const FormType = {
    CREATE : 'Create',
    FILL : 'Fill',
    CANCEL : 'Cancel',
    WRAP_ETH : 'Wrap ETH',
    GET_ORDER_INFO :'Order Info'
}


export class ZeroExMultiBuyAction extends React.Component {

  
    state = { selectedForm: FormType.CREATE };
    onTxSubmitted = async (txHash) => {
        const { toastManager, web3Wrapper } = this.props;
        if (txHash) {
            toastManager.add(`Transaction Submitted: ${txHash}`, {
                appearance: 'success',
                autoDismiss: true,
            });
            const receipt = await web3Wrapper.awaitTransactionMinedAsync(txHash);
            const appearance = receipt.status === 1 ? 'success' : 'error';
            toastManager.add(`Transaction Mined: ${txHash}`, {
                appearance,
                autoDismiss: true,
            });
        }
    }
    
    render(){
        const { selectedForm } = this.state;
        const { web3Wrapper, contractWrappers } = this.props;
        const defaultProps = { web3Wrapper, contractWrappers, onTxSubmitted: this.onTxSubmitted };
      
        let currentFormRender = <CreateAndExecuteMultiple{...defaultProps} />;
      
        const panelTabsRender = _.map(Object.keys(FormType), formType => {
            const type = FormType[formType];
            const isActive = selectedForm === type;
            const className = isActive ? 'is-active' : '';
            return (
                <a key={type} onClick={() => this.setState({ selectedForm: type })} className={className}>
                    {type}
                </a>
            );
        });
        return (
            <Content>
                <Subtitle isSize={6}>Try 0x.js</Subtitle>
                <p> Below are common examples of 0x.js actions you will come across when creating your dApp </p>
                <Columns>
                    <Column isSize={{ mobile: 11, default: 7 }}>
                        <Panel>
                            <PanelTabs>{panelTabsRender}</PanelTabs>
                            {currentFormRender}
                        </Panel>
                    </Column>
                </Columns>
            </Content>
        );
    }
}
