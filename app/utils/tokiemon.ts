import { type Address } from 'viem'
import { useReadContract, useReadContracts } from 'wagmi'
import tokiemonABI from '~/abi/tokiemonABI.json'
import { TOKIEMON_CONTRACT_ADDRESS } from './constants'

const wagmiContractConfig = {
    address: '0x802187c392b15cdc8df8aa05bfef314df1f65c62',
    abi: tokiemonABI,
} as const


export const useTokiemonBalance = (address: Address) => {
    const { data: balance } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'balanceOf',
        args: [address],
    })
    return { balance: balance as number || 0 }
}


export const useUserTokenIds = (address: Address, balance: number) => {
    const tokenRequests = Array.from({ length: Number(balance) }, (_, i) => ({
        address: TOKIEMON_CONTRACT_ADDRESS,
        abi: tokiemonABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [address, i],
    }));

    // Fetch all token IDs in one batch call
    const { data: tokenIds, isLoading } = useReadContracts({
        contracts: tokenRequests,
    });
    return { data: tokenIds || [], isLoading };
}

export const fetchNFTDatas = (tokenIds: any) => {
    const promises = tokenIds.map((tokenId: number) =>
        fetch(`https://api.tokiemon.io/tokiemon/${tokenId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch token ${tokenId}: ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => ({ error: error.message, tokenId }))
    );
    return Promise.all(promises);
}