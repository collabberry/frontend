export const shortenTxHash = (hash: string, blockExplorer: string, start = 6, end = 4,) => {
    if (!hash) return ''
    return `${blockExplorer}/${hash.slice(0, start)}...${hash.slice(-end)}`
}

export const shortenAddress = (address: string, start = 6, end = 4,) => {
    if (!address) return ''
    return `${address.slice(0, start)}...${address.slice(-end)}`
}