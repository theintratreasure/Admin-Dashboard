type OnMessage = (msg: unknown) => void;

export class MarketSocket {
  private socket: WebSocket | null = null;
  private pendingSubscriptions: Set<string> = new Set();
  private isConnecting = false;
  private shouldCloseOnOpen = false;
  private manualClose = false;

  connect(token: string, onMessage: OnMessage): void {
    const rawBaseUrl = process.env.NEXT_PUBLIC_SOKET_API_URL;

    if (!rawBaseUrl) {
      console.error("NEXT_PUBLIC_SOKET_API_URL is not defined");
      return;
    }

    const baseUrl = normalizeWebSocketUrl(rawBaseUrl);

    // Prevent multiple connections
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    if (this.isConnecting) return;

    this.isConnecting = true;
    this.shouldCloseOnOpen = false;
    this.manualClose = false;

    try {
      this.socket = new WebSocket(`${baseUrl}?token=${token}`);
    } catch (err) {
      console.error("WebSocket init failed:", err);
      this.isConnecting = false;
      return;
    }

    this.socket.onopen = () => {
      console.log("Market socket connected");

      this.isConnecting = false;

      if (this.shouldCloseOnOpen) {
        this.manualClose = true;
        this.socket?.close(1000, "Client closed");
        return;
      }

      this.pendingSubscriptions.forEach((symbol) => {
        this.sendSubscribe(symbol);
      });

      this.pendingSubscriptions.clear();
    };

    this.socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const parsed: unknown = JSON.parse(event.data);
        onMessage(parsed);
      } catch (err) {
        console.error("Invalid socket JSON:", err);
      }
    };

    this.socket.onerror = () => {
      if (this.manualClose || this.shouldCloseOnOpen) return;
      console.error("Market socket error");
    };

    this.socket.onclose = (e: CloseEvent) => {
      if (!this.manualClose && !this.shouldCloseOnOpen) {
        console.warn("Market socket closed:", {
          code: e.code,
          reason: e.reason,
          wasClean: e.wasClean,
        });
      }

      this.socket = null;
      this.isConnecting = false;
      this.shouldCloseOnOpen = false;
      this.manualClose = false;
    };
  }

  subscribe(symbol: string): void {
    if (!this.socket) {
      this.pendingSubscriptions.add(symbol);
      return;
    }

    if (this.socket.readyState === WebSocket.OPEN) {
      this.sendSubscribe(symbol);
    } else {
      this.pendingSubscriptions.add(symbol);
    }
  }

  unsubscribe(symbol: string): void {
    if (!this.socket) return;

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "unsubscribe",
          market: "crypto",
          symbol,
        })
      );
    }

    this.pendingSubscriptions.delete(symbol);
  }

  private sendSubscribe(symbol: string): void {
    if (!this.socket) return;

    if (this.socket.readyState !== WebSocket.OPEN) {
      this.pendingSubscriptions.add(symbol);
      return;
    }

    this.socket.send(
      JSON.stringify({
        type: "subscribe",
        market: "crypto",
        symbol,
        depth: 1,
      })
    );
  }

  close(): void {
    if (!this.socket) return;

    if (this.socket.readyState === WebSocket.CONNECTING) {
      this.shouldCloseOnOpen = true;
      this.manualClose = true;
      return;
    }

    if (this.socket.readyState === WebSocket.OPEN) {
      this.manualClose = true;
      this.socket.close(1000, "Client closed");
    }

    this.socket = null;

    this.pendingSubscriptions.clear();
    this.isConnecting = false;
  }
}

export function getMarketBySymbol(symbol: string): string {
  if (symbol.endsWith("USDT")) return "crypto";
  if (symbol.endsWith("USD") || symbol.endsWith("JPY")) return "forex";
  if (symbol.startsWith("XAU") || symbol.startsWith("XAG")) return "metal";

  return "crypto";
}

export function getAccessTokenFromCookie(): string {
  if (typeof document === "undefined") return "";

  const match = document.cookie.match(/accessToken=([^;]+)/);

  return match ? decodeURIComponent(match[1]) : "";
}

function normalizeWebSocketUrl(url: string): string {
  if (url.startsWith("ws://") || url.startsWith("wss://")) return url;
  if (url.startsWith("http://")) return `ws://${url.slice("http://".length)}`;
  if (url.startsWith("https://")) return `wss://${url.slice("https://".length)}`;
  if (url.startsWith("//")) {
    const protocol =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "wss:"
        : "ws:";
    return `${protocol}${url}`;
  }
  return url;
}
