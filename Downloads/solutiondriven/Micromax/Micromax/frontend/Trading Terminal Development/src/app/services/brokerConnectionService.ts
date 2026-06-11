const GO_BRIDGE_BASE =
  (import.meta as any).env.VITE_GO_BRIDGE_URL?.trim() || 'https://micromax-trading-terminal.onrender.com';

export type BrokerExchange = 'binance' | 'bitget';

export interface BalanceEntry {
  asset?: string;
  coin?: string;
  free?: string;
  locked?: string;
  available?: string;
  frozen?: string;
  limit_available?: string;
  updated_at?: string;
}

export interface BrokerConnectResponse {
  exchange: BrokerExchange;
  success: boolean;
  label?: string;
  balances?: BalanceEntry[];
  non_zero?: BalanceEntry[];
  count?: number;
  non_zero_count?: number;
  error?: string;
}

class BrokerConnectionService {
  private async post(path: string, body: Record<string, unknown>): Promise<BrokerConnectResponse> {
    const response = await fetch(`${GO_BRIDGE_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as BrokerConnectResponse;

    if (!response.ok) {
      return {
        exchange: data.exchange || 'binance',
        success: false,
        error: data.error || 'Broker connection failed',
      };
    }

    return data;
  }

  async connectBinance(apiKey: string, secretKey: string, label?: string) {
    return this.post('/connect/binance', {
      api_key: apiKey,
      secret_key: secretKey,
      label,
    });
  }

  async connectBitget(apiKey: string, secretKey: string, passphrase: string, label?: string) {
    return this.post('/connect/bitget', {
      api_key: apiKey,
      secret_key: secretKey,
      passphrase,
      label,
    });
  }
}

let serviceInstance: BrokerConnectionService | null = null;

export function getBrokerConnectionService() {
  if (!serviceInstance) {
    serviceInstance = new BrokerConnectionService();
  }
  return serviceInstance;
}
