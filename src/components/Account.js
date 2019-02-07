import { BigNumber, ERC20TokenWrapper } from '0x.js';
import { DummyERC20TokenContract } from '@0x/abi-gen-wrappers';
import { DummyERC20Token } from '@0x/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Button, Content, Icon, Subtitle, Table, Tag } from 'bloomer';
import * as _ from 'lodash';
import * as React from 'react';

import { ETHER_TOKEN, TOKENS_BY_NETWORK } from './0x/tokens';

const ACCOUNT_CHECK_INTERVAL_MS = 2000;
const MAX_MINTABLE_AMOUNT = new BigNumber('10000000000000000000000');
const GREEN = '#00d1b2';



export class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = { balances: {}, selectedAccount: '' };
        void this.fetchAccountDetailsAsync();
        setInterval(() => {
            void this.checkAccountChangeAsync();
        }, ACCOUNT_CHECK_INTERVAL_MS);
    }

    async fetchAccountDetailsAsync() {
        const { web3Wrapper, erc20TokenWrapper } = this.props;
        const { balances } = this.state;
        const addresses = await web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        if (_.isUndefined(address)) {
            return;
        }
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const tokens = TOKENS_BY_NETWORK[networkId];
        // Fetch all the Balances for all of the tokens
        const allBalancesAsync = _.map(
            tokens,
            async (token) => {
                if (!token.address) {
                    return undefined;
                }
                try {
                    const balance = await erc20TokenWrapper.getBalanceAsync(token.address, address);
                    const allowance = await erc20TokenWrapper.getProxyAllowanceAsync(token.address, address);
                    const numberBalance = new BigNumber(balance);
                    return { token, balance: numberBalance, allowance };
                } catch (e) {
                    console.log(e);
                    return undefined;
                }
            },
        );

        const results = await Promise.all(allBalancesAsync);
        balances[address] = _.compact(results);
        // Fetch the Balance of Ether
        const weiBalance = await web3Wrapper.getBalanceInWeiAsync(address);
        balances[address] = [
            ...balances[address],
            {
                token: ETHER_TOKEN,
                balance: weiBalance,
                allowance: new BigNumber(0)
            } 
        ];

        this.setState(prev => {
            const prevSelectedAccount = prev.selectedAccount;
            const selectedAccount = prevSelectedAccount !== address ? address : prevSelectedAccount;
            return { ...prev, balances, selectedAccount };
        });
    }
    
    async checkAccountChangeAsync() {
        const { web3Wrapper } = this.props;
        const { selectedAccount } = this.state;
        const addresses = await web3Wrapper.getAvailableAddressesAsync();
        const address = addresses[0];
        if (_.isUndefined(address)) {
            return;
        }
        if (selectedAccount !== address) {
            const balances = {};
            this.setState(prev => ({ ...prev, balances, selectedAccount }));
            void this.fetchAccountDetailsAsync();
        }
    }
    
    async setProxyAllowanceAsync(tokenAddress) {
        const { erc20TokenWrapper } = this.props;
        const { selectedAccount } = this.state;
        const txHash = await erc20TokenWrapper.setUnlimitedProxyAllowanceAsync(tokenAddress, selectedAccount);
        void this.transactionSubmittedAsync(txHash);
    }

    
    async mintTokenAsync(tokenBalance) {
        const { selectedAccount } = this.state;
        const token = new DummyERC20TokenContract(
            (DummyERC20Token).compilerOutput.abi,
            tokenBalance.token.address,
            this.props.web3Wrapper.getProvider(),
        );
        const maxAmount = await token.MAX_MINT_AMOUNT.callAsync();
        const balanceDiffToMaxAmount = maxAmount.minus(tokenBalance.balance);
        const amountToMint = BigNumber.min(maxAmount, balanceDiffToMaxAmount);
        const txHash = await token.mint.sendTransactionAsync(amountToMint, { from: selectedAccount });
        void this.transactionSubmittedAsync(txHash);
    }

    async transactionSubmittedAsync(txHash) {
        const { toastManager, web3Wrapper } = this.props;
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
        await this.fetchAccountDetailsAsync();
    }

    render() {
        const { balances, selectedAccount } = this.state;
        const accountBalances = balances[selectedAccount];
        const fetchBalancesButton = (
            <Button
                isSize="small"
                class="btn btn-secondary"
                isColor="info"
                id="fetchAccountBalances"
                onClick={this.fetchAccountDetailsAsync.bind(this)}
            >
                Fetch Balances
            </Button>
        );
        let contentRender = (
            <div>
                <strong>Fetching Balances...</strong>
            </div>
        );

        if (!_.isEmpty(accountBalances)) {
            const balanceRows = _.map(accountBalances, (tokenBalance: TokenBalanceAllowance) => {
                const { name, symbol, image } = tokenBalance.token;
                const tokenIcon = <img src={image} style={{ width: '28px', height: '28px' }} />;
                // Convert to the human readable amount based off the token decimals
                const balance = Web3Wrapper.toUnitAmount(tokenBalance.balance, tokenBalance.token.decimals);
                const balanceRender = balance.toFixed(4);
                const allowanceRender = this.renderAllowanceForTokenBalance(tokenBalance);
                const mintRender = this.renderMintForTokenBalance(tokenBalance);
                return (
                    <tr key={name}>
                        <td>{tokenIcon}</td>
                        <td>{symbol}</td>
                        <td>{balanceRender}</td>
                    </tr>
                );
            });
            contentRender = (
                   <div className="level level-left">
                       <p><small>Note: If you just purchased a portfolio of tokens, it may some take some time for your updated balances to show up.</small></p>
                
                    <Table isNarrow={true}>
                        <thead>
                            <tr>
                                <th>Token</th>
                                <th>Symbol</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>{balanceRows}</tbody>
                    </Table>
                </div>
            );
        }

        return (
            <Content style={{ marginTop: '15px' }}>
                <Subtitle isSize={4}>
                    <small><Tag>Account</Tag> {selectedAccount}</small>
                </Subtitle>
                <div className="level">
                    <div className="level-left">
                        <div className="level-item">{contentRender}</div>
                    </div>
                </div>
            </Content>
        );
    }
    
    renderAllowanceForTokenBalance(tokenBalance) {
        let allowanceRender;
        if (tokenBalance.token.isTradeable) {
            allowanceRender = tokenBalance.allowance.greaterThan(0) ? (
                <Icon isSize="small" className="fa fa-check-circle" style={{ color: GREEN }} />
            ) : (
                <a href="#" onClick={() => void this.setProxyAllowanceAsync(tokenBalance.token.address)}>
                    <Icon isSize="small" className="fa fa-lock" />
                </a>
            );
        } else {
            allowanceRender = <div />;
        }
        return allowanceRender;
    }
    
    renderMintForTokenBalance(tokenBalance) {
        if (tokenBalance.token.isMintable && tokenBalance.balance.lt(MAX_MINTABLE_AMOUNT)) {
            return (
                <a href="#" onClick={() => void this.mintTokenAsync(tokenBalance)}>
                    <Icon isSize="small" className="fa fa-coins" />
                </a>
            );
        } else {
            return <div />;
        }
    }
}
