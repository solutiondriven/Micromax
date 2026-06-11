import { X, ExternalLink, AlertCircle } from 'lucide-react';

interface MT5WebTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  brokerConnection: {
    accountId: string;
    serverName: string;
    brokerLabel: string;
    metaApiId?: string;
    terminalUrl?: string;
    configurationLink?: string;
  } | null;
}

export function MT5WebTerminal({ isOpen, onClose, isDark, brokerConnection }: MT5WebTerminalProps) {
  if (!isOpen || !brokerConnection) return null;

  const fallbackUrl = 'https://www.metatrader5.com/en/trading-platform/web-trading';
  const terminalUrl =
    brokerConnection.terminalUrl?.trim() ||
    brokerConnection.configurationLink?.trim() ||
    fallbackUrl;
  const terminalLabel = brokerConnection.terminalUrl
    ? 'Open Web Terminal'
    : brokerConnection.configurationLink
      ? 'Open Secure Configuration'
      : 'Open MetaTrader Web Platform';

  const handleOpenTerminal = () => {
    window.open(terminalUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
  };

  const handleCopyMetaApiId = () => {
    if (brokerConnection.metaApiId) {
      navigator.clipboard.writeText(brokerConnection.metaApiId);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] ${
          isDark ? 'bg-[#1a1a1a]' : 'bg-white'
        } rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-[#3a3a3a]' : 'border-[#d0d0d0]'
          }`}
        >
          <div>
            <h2
              className={`text-xl font-semibold ${
                isDark ? 'text-[#e8e8e8]' : 'text-[#2a2a2a]'
              }`}
            >
              {brokerConnection.brokerLabel} - Web Trading Terminal
            </h2>
            <p
              className={`text-sm mt-1 ${
                isDark ? 'text-[#9a9a9a]' : 'text-[#6a6a6a]'
              }`}
            >
              Access your trading account and place trades in real-time
            </p>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg ${
              isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#f0f0f0]'
            } flex items-center justify-center transition-colors`}
          >
            <X
              className={`w-5 h-5 ${
                isDark ? 'text-[#9a9a9a]' : 'text-[#6a6a6a]'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Account Info Card */}
          <div
            className={`rounded-2xl border p-5 ${
              isDark ? 'bg-[#202020] border-[#3a3a3a]' : 'bg-[#fafafa] border-[#d0d0d0]'
            }`}
          >
            <div className="space-y-3">
              <div>
                <div
                  className={`text-xs font-medium mb-1 ${
                    isDark ? 'text-[#9a9a9a]' : 'text-[#6a6a6a]'
                  }`}
                >
                  MT5 Login
                </div>
                <div
                  className={`text-sm font-mono ${
                    isDark ? 'text-[#e8e8e8]' : 'text-[#2a2a2a]'
                  }`}
                >
                  {brokerConnection.accountId}
                </div>
              </div>
              <div>
                <div
                  className={`text-xs font-medium mb-1 ${
                    isDark ? 'text-[#9a9a9a]' : 'text-[#6a6a6a]'
                  }`}
                >
                  Server
                </div>
                <div
                  className={`text-sm font-mono ${
                    isDark ? 'text-[#e8e8e8]' : 'text-[#2a2a2a]'
                  }`}
                >
                  {brokerConnection.serverName}
                </div>
              </div>
              {brokerConnection.metaApiId && (
                <div>
                  <div
                    className={`text-xs font-medium mb-1 ${
                      isDark ? 'text-[#9a9a9a]' : 'text-[#6a6a6a]'
                    }`}
                  >
                    MetaAPI Account ID
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-sm font-mono flex-1 ${
                        isDark ? 'text-[#e8e8e8]' : 'text-[#2a2a2a]'
                      }`}
                    >
                      {brokerConnection.metaApiId.substring(0, 20)}...
                    </div>
                    <button
                      onClick={handleCopyMetaApiId}
                      className={`text-xs px-2.5 py-1 rounded transition-colors ${
                        isDark
                          ? 'bg-[#2a2a2a] hover:bg-[#333333] text-[#9a9a9a]'
                          : 'bg-white hover:bg-[#f0f0f0] text-[#6a6a6a] border border-[#d0d0d0]'
                      }`}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <div
            className={`rounded-2xl border p-4 flex gap-3 ${
              isDark
                ? 'bg-blue-900/20 border-blue-700/50'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}
            />
            <div>
              <div
                className={`text-sm font-medium ${
                  isDark ? 'text-blue-300' : 'text-blue-900'
                }`}
              >
                How to Trade
              </div>
              <div
                className={`text-xs mt-2 space-y-1 ${
                  isDark ? 'text-blue-200' : 'text-blue-800'
                }`}
              >
                <p>1. Open the broker-provided terminal link</p>
                <p>2. Log in with your MT5 credentials</p>
                <p>3. Browse instruments and place trades</p>
                <p>4. Monitor open positions and account balance in real-time</p>
              </div>
            </div>
          </div>

          {!brokerConnection.terminalUrl && !brokerConnection.configurationLink && (
            <div
              className={`rounded-2xl border p-4 ${
                isDark ? 'bg-amber-900/20 border-amber-700/50' : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className={`text-xs ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                Your broker did not provide a direct web terminal URL, so this button opens MetaTrader's official web trading page. If your broker has a specific terminal link, paste it into the connection form so we can open trading directly.
              </div>
            </div>
          )}

          {/* Trading Tips */}
          <div
            className={`rounded-2xl border p-4 space-y-3 ${
              isDark ? 'bg-[#202020] border-[#3a3a3a]' : 'bg-[#fafafa] border-[#d0d0d0]'
            }`}
          >
            <div
              className={`text-sm font-semibold ${
                isDark ? 'text-[#e8e8e8]' : 'text-[#2a2a2a]'
              }`}
            >
              💡 Trading Tips
            </div>
            <ul
              className={`text-xs space-y-2 ${
                isDark ? 'text-[#9a9a9a]' : 'text-[#6a6a6a]'
              }`}
            >
              <li>✓ Always use stop loss orders to manage risk</li>
              <li>✓ Start with small position sizes while learning</li>
              <li>✓ Monitor economic calendars for major events</li>
              <li>✓ Keep your leverage conservative for safety</li>
              <li>✓ Review daily charts for trend confirmation</li>
            </ul>
          </div>

          {/* Risk Warning */}
          <div
            className={`rounded-2xl border p-4 ${
              isDark
                ? 'bg-red-900/20 border-red-700/50'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div
              className={`text-xs font-medium ${
                isDark ? 'text-red-300' : 'text-red-900'
              }`}
            >
              ⚠️ Risk Disclaimer: Forex trading involves significant risk of loss. Past performance does not guarantee future results. Trade only with capital you can afford to lose.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`p-6 border-t space-y-3 ${
            isDark ? 'border-[#3a3a3a]' : 'border-[#d0d0d0]'
          }`}
        >
          <button
            onClick={handleOpenTerminal}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            {terminalLabel}
          </button>
          <button
            onClick={onClose}
            className={`w-full px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              isDark
                ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] text-[#e8e8e8]'
                : 'bg-white hover:bg-[#f0f0f0] border border-[#d0d0d0] text-[#2a2a2a]'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
