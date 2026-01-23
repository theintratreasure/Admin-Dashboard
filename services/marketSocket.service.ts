
type OnMessage = (msg: any) => void;

export class MarketSocket {
  private socket: WebSocket | null = null;
  private pendingSubscriptions: Set<string> = new Set();
    
  connect(token: string, onMessage: OnMessage) {
    this.socket = new WebSocket(
      `ws://localhost:4000/ws/market?token=${token}`
    );
    

    this.socket.onopen = () => {
      // 🔁 flush pending subs
      this.pendingSubscriptions.forEach((symbol) => {
        this.sendSubscribe(symbol);
      });
      this.pendingSubscriptions.clear();
    };

    this.socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      onMessage(parsed);
    };
  }

  subscribe(symbol: string) {
    if (!this.socket) return;

    if (this.socket.readyState === WebSocket.OPEN) {
      this.sendSubscribe(symbol);
    } else {
      this.pendingSubscriptions.add(symbol);
    }
  }

 unsubscribe(symbol: string) {
  if (!this.socket) return;

  const market = getMarketBySymbol(symbol);

  if (this.socket.readyState === WebSocket.OPEN) {
    this.socket.send(
      JSON.stringify({
        type: "unsubscribe",
        market,
        symbol,
      })
    );
  }

  this.pendingSubscriptions.delete(symbol);
}

 private sendSubscribe(symbol: string) {
    this.socket?.send(
      JSON.stringify({
        type: "subscribe",
        market: "crypto",
        symbol,
        depth: 1,
      })
    );
  }

  close() {
    this.socket?.close();
    this.pendingSubscriptions.clear();
  }
}
export function getMarketBySymbol(symbol: string) {
  if (symbol.endsWith("USDT")) return "crypto";
  if (symbol.endsWith("USD") || symbol.endsWith("JPY")) return "forex";
  if (symbol.startsWith("XAU") || symbol.startsWith("XAG")) return "metal";
  return "crypto";
}

export function getAccessTokenFromCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}
