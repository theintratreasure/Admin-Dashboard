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

    function pickNumber(...values: Array<number | string | undefined | null>) {
        for (const v of values) {
            if (v === undefined || v === null) continue;
            const n = Number(v);
            if (Number.isFinite(n)) return n;
        }
        return undefined;
    }

    /* SOCKET INIT */
    useEffect(() => {
        if (!token) return;
        const socket = new MarketSocket();
        socketRef.current = socket;

        socket.connect(token, (msg: any) => {
            if (msg.status === "subscribed") {
                const s = msg.symbol;
                if (!bufferRef.current[s]) return;

                const nextOpen = pickNumber(
                    msg.dayOpen,
                    msg.open,
                    msg.data?.dayOpen,
                    msg.data?.open
                );
                const nextClose = pickNumber(
                    msg.dayClose,
                    msg.close,
                    msg.data?.dayClose,
                    msg.data?.close,
                    msg.prevClose,
                    msg.data?.prevClose
                );

                bufferRef.current[s] = {
                    ...bufferRef.current[s],
                    high: Number(msg.dayHigh),
                    low: Number(msg.dayLow),
                    open: nextOpen ?? bufferRef.current[s].open,
                    close: nextClose ?? bufferRef.current[s].close,
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

                const nextOpen = pickNumber(
                    msg.data?.dayOpen,
                    msg.data?.open,
                    msg.data?.openPrice
                );
                const nextClose = pickNumber(
                    msg.data?.dayClose,
                    msg.data?.close,
                    msg.data?.prevClose
                );

                bufferRef.current[s] = {
                    ...old,
                    bid: bid.price,
                    ask: ask.price,
                    bidVolume: bid.volume,
                    askVolume: ask.volume,
                    high: msg.data.dayHigh ?? old.high,
                    low: msg.data.dayLow ?? old.low,
                    open: nextOpen ?? old.open,
                    close: nextClose ?? old.close,
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

        // subscribe any symbols that were queued before socket was ready
        subscribedRef.current.forEach((s) => {
            socket.subscribe(s);
        });

        return () => {
            socket.close();
            socketRef.current = null;
        };
    }, [token]);

    /* SYMBOL SYNC */
    useEffect(() => {
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
                socketRef.current?.subscribe(s);
            }
        });

        Object.keys(bufferRef.current).forEach((s) => {
            if (!next.has(s)) {
                delete bufferRef.current[s];
                subscribedRef.current.delete(s);
                socketRef.current?.unsubscribe(s);
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
