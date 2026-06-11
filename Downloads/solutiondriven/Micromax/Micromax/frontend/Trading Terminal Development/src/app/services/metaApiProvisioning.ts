/**
 * MetaApi Account Provisioning Service
 * Frontend service that calls backend API to provision MT5 accounts
 * 
 * Calls our backend endpoints:
 * - POST /api/accounts/provision/draft
 * - POST /api/accounts/provision/direct
 * - GET /api/accounts/:id/status
 */

const API_BASE = 'http://localhost:3000/api/accounts';

export interface AccountStatus {
  accountId: string;
  status: 'UNDEPLOYED' | 'DEPLOYING' | 'DEPLOYED' | 'DISCONNECTED' | 'ERROR';
  dataCenter?: string;
  estimatedLatency?: number;
  error?: string;
}

export class MetaApiAccountProvisioning {
  constructor() {
    // No config needed - we just call the backend
  }

  /**
   * Create account using Draft Mode (RECOMMENDED)
   * - User only enters name + server
   * - Gets secure link to enter password on MetaApi's official site
   * - Maximum security, better trust
   */
  async createAccountDraftMode(userData: {
    fullName: string;
    mt5Server: string;
    userId?: string;
  }): Promise<{
    success: boolean;
    accountId?: string;
    configurationLink?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE}/provision/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: userData.fullName,
          mt5Server: userData.mt5Server,
          userId: userData.userId || 'guest'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      return {
        success: true,
        accountId: data.accountId,
        configurationLink: data.configurationLink
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create account'
      };
    }
  }

  /**
   * Create account using Direct Method
   * - User enters password in your form
   * - Your backend sends to MetaApi, then forgets password
   * - Faster, but requires trust
   */
  async createAccountDirect(userData: {
    fullName: string;
    mt5Login: string;
    mt5Password: string;
    mt5Server: string;
    userId?: string;
  }): Promise<{
    success: boolean;
    accountId?: string;
    configurationLink?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE}/provision/direct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: userData.fullName,
          mt5Login: userData.mt5Login,
          mt5Password: userData.mt5Password,
          mt5Server: userData.mt5Server,
          userId: userData.userId || 'guest'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      return {
        success: true,
        accountId: data.accountId,
        configurationLink: data.configurationLink
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create account'
      };
    }
  }

  /**
   * Get account status
   */
  async getAccountStatus(accountId: string): Promise<AccountStatus> {
    try {
      const response = await fetch(`${API_BASE}/${accountId}/status`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get status');
      }

      return {
        accountId: data.accountId,
        status: data.status,
        dataCenter: data.dataCenter,
        estimatedLatency: data.estimatedLatency,
        error: data.error
      };
    } catch (error: any) {
      return {
        accountId,
        status: 'ERROR' as const,
        error: error.message
      };
    }
  }

  /**
   * Wait for deployment
   */
  async waitForDeployment(
    accountId: string,
    maxWaitSeconds: number = 120,
    onProgress?: (status: AccountStatus) => void
  ): Promise<AccountStatus> {
    const startTime = Date.now();
    const maxWaitMs = maxWaitSeconds * 1000;

    while (Date.now() - startTime < maxWaitMs) {
      const status = await this.getAccountStatus(accountId);
      
      if (onProgress) {
        onProgress(status);
      }

      if (status.status === 'DEPLOYED') {
        return status;
      }

      if (status.status === 'ERROR') {
        throw new Error(status.error || 'Deployment failed');
      }

      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Deployment timeout');
  }

  /**
   * List all accounts
   */
  async listAccounts(): Promise<AccountStatus[]> {
    try {
      const response = await fetch(`${API_BASE}/list`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to list accounts');
      }

      return data.accounts || [];
    } catch (error: any) {
      console.error('Failed to list accounts:', error.message);
      return [];
    }
  }
}

// Singleton instance
let provisioning: MetaApiAccountProvisioning | null = null;

export function initializeProvisioning() {
  if (!provisioning) {
    provisioning = new MetaApiAccountProvisioning();
  }
  return provisioning;
}

export function getProvisioning(): MetaApiAccountProvisioning {
  if (!provisioning) {
    provisioning = new MetaApiAccountProvisioning();
  }
  return provisioning;
}
