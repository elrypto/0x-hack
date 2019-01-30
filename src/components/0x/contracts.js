import { DummyERC721TokenContract } from '@0x/abi-gen-wrappers';
import { getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses';
import { DummyERC721Token } from '@0x/contract-artifacts';

import { NETWORK_CONFIGS } from './configs';
import { GANACHE_NETWORK_ID, KOVAN_NETWORK_ID, RINKEBY_NETWORK_ID, ROPSTEN_NETWORK_ID } from './constants';
import { providerEngine } from './provider_engine';


export const contractAddresses = getContractAddressesForNetworkOrThrow(NETWORK_CONFIGS.networkId);
