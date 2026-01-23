"use client";

import { MarketSocket } from "@/services/marketSocket.service";
import { QuoteLiveState } from "@/types/market";
import { useEffect, useRef, useState } from "react";

type QuoteMap = Record<string, QuoteLiveState>;

export function useLiveQuotesBySymbols(
    token: string,
    symbols: string[]
) {
    const socketRef = useRef<MarketSocket | null>(null);
    const bufferRef = useRef<QuoteMap>({});
    const subscribedRef = useRef<Set<string>>(new Set());
    const frameRef = useRef<number | null>(null);

    const [quotes, setQuotes] = useState<QuoteMap>({});

    /* SOCKET INIT */
    useEffect(() => {
        if (!token) return;
        const socket = new MarketSocket();
        socketRef.current = socket;

        socket.connect(token, (msg: any) => {
            if (msg.status === "subscribed") {
                const s = msg.symbol;
                if (!bufferRef.current[s]) return;

                bufferRef.current[s] = {
                    ...bufferRef.current[s],
                    high: Number(msg.dayHigh),
                    low: Number(msg.dayLow),
                };
                flush();
                return;
            }

            if (msg.type === "orderbook") {
                const s = msg.data.code;
                const bid = msg.data.bids?.[0];
                const ask = msg.data.asks?.[0];
                if (!bid || !ask) return;

                const old = bufferRef.current[s];
                if (!old) return;

                bufferRef.current[s] = {
                    ...old,
                    bid: bid.price,
                    ask: ask.price,
                    bidVolume: bid.volume,
                    askVolume: ask.volume,
                    high: msg.data.dayHigh ?? old.high,
                    low: msg.data.dayLow ?? old.low,
                    bidDir:
                        old.bid === "--"
                            ? "same"
                            : Number(bid.price) > Number(old.bid)
                                ? "up"
                                : Number(bid.price) < Number(old.bid)
                                    ? "down"
                                    : old.bidDir,
                    askDir:
                        old.ask === "--"
                            ? "same"
                            : Number(ask.price) > Number(old.ask)
                                ? "up"
                                : Number(ask.price) < Number(old.ask)
                                    ? "down"
                                    : old.askDir,
                };

                flush();
            }

        });

        return () => {
            socket.close();
            socketRef.current = null;
        };
    }, [token]);

    /* SYMBOL SYNC */
    useEffect(() => {
        if (!socketRef.current) return;

        const next = new Set(symbols);

        symbols.forEach((s) => {
            if (!subscribedRef.current.has(s)) {
                subscribedRef.current.add(s);
                bufferRef.current[s] = {
                    symbol: s,
                    bid: "--",
                    ask: "--",
                    bidVolume: "--",
                    askVolume: "--",
                    bidDir: "same",
                    askDir: "same",
                };
                socketRef.current!.subscribe(s);
            }
        });

        Object.keys(bufferRef.current).forEach((s) => {
            if (!next.has(s)) {
                delete bufferRef.current[s];
                subscribedRef.current.delete(s);
                socketRef.current!.unsubscribe(s);
            }
        });

        flush();
    }, [symbols]);

    function flush() {
        if (frameRef.current) return;
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = null;
            setQuotes({ ...bufferRef.current });
        });
    }

    return quotes;
}
