import React, { useState } from 'react'
import useWalrus from './hooks/useWalrus'
import { fetchUserBlobs, fetchAccountBlobEvents, fetchStakingOperations, fetchOperatorInteractions, fetchBlobLifetime } from './api/walrus'

export default function App() {
	const [account, setAccount] = useState('0x123abc')
	const { overview, walPriceUSD, storageCosts, loading, error } = useWalrus(100, 'GB')

	async function demo() {
		const blobs = await fetchUserBlobs(account)
		const events = await fetchAccountBlobEvents(account)
		const staking = await fetchStakingOperations(account)
		const operators = await fetchOperatorInteractions(account)
		const lifetime = blobs[0] ? await fetchBlobLifetime(blobs[0].id) : null
		console.log({ blobs, events, staking, operators, lifetime })
	}

	return (
		<div style={{ padding: 16, fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
			<h1>Sui Dashboard – Walrus</h1>
			<div style={{ marginBottom: 12 }}>
				<label>
					Account:&nbsp;
					<input value={account} onChange={e => setAccount(e.target.value)} style={{ width: 320 }} />
				</label>
				<button onClick={demo} style={{ marginLeft: 8 }}>Console Demo</button>
			</div>

			{loading && <p>Loading overview…</p>}
			{error && <p style={{ color: 'crimson' }}>{error}</p>}

			{overview && (
				<div style={{ display: 'grid', gap: 8 }}>
					<div>WAL price (USD): {walPriceUSD?.toFixed(6)}</div>
					<div>Epoch: {overview.networkConfig.currentEpoch}</div>
					<div>Storage price/MB: {overview.storagePricing.storagePricePerMB}</div>
				</div>
			)}

			{storageCosts && (
				<div style={{ marginTop: 16 }}>
					<h3>Storage Costs</h3>
					<ul>
						{storageCosts.map((c, i) => (
							<li key={i}>{c.period}: {c.costWAL} WAL (~${(c.costUSD).toFixed(6)})</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
} 