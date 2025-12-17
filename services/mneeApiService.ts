import { MneeConfig } from '../types';

const API_URL = 'https://sandbox-proxy-api.mnee.net/v1/config';
// Note: In a real production app, the auth token should be handled securely via a backend proxy.
// For the hackathon demo, we attempt to fetch, and fallback to mock data if auth/CORS fails.
const MOCK_CONFIG: MneeConfig = {
  approver: "02bed35e894cc41cc9879b4002ad03d33533b615c1...",
  decimals: 5,
  feeAddress: "1H9wgHCTHjmgBw4PAbQ4PQBQHGFxHWhjbU",
  burnAddress: "1HNuPi9Y7nMV6x8crJ6DnD1wJtkLym8EFE",
  mintAddress: "1AZNdbFYBDFTAEgzZMfPzANxyNrpGJZAUY",
  fees: [
    {
      "fee": 1000,
      "max": 1000000,
      "min": 10000
    }
  ],
  tokenId: "833a7720966a2a435db28d967385e8aa7284b6150eb..."
};

export const fetchMneeConfig = async (): Promise<MneeConfig> => {
  try {
    console.log("Fetching MNEE Configuration...");
    
    // In a browser environment, direct calls to APIs often fail due to CORS if the server doesn't explicitly allow it.
    // Additionally, this API requires an 'auth_token'. 
    // We wrap this in a try/catch to ensure the app falls back to MOCK_CONFIG seamlessly.
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // 'auth_token': 'YOUR_API_KEY' // Insert API Key here if running locally with CORS disabled or proxy
      }
    });

    if (!response.ok) {
      console.warn(`MNEE API returned status ${response.status}. Using embedded configuration.`);
      return MOCK_CONFIG;
    }

    const data = await response.json();
    console.log("✅ MNEE Configuration Loaded:", data);
    return data as MneeConfig;
  } catch (error) {
    // This is the expected behavior for the demo deployment without a backend proxy
    console.warn("MNEE API not reachable (likely CORS or missing Auth). Using offline demo configuration.");
    return MOCK_CONFIG;
  }
};