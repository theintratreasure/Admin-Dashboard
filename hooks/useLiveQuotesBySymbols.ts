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

    function pickNumber(...values: Array<unknown>) {
        for (const v of values) {
            if (v === undefined || v === null) continue;
            const n = Number(v);
            if (Number.isFinite(n)) return n;
        }
        return undefined;
    }

    function isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null;
    }

    function flush() {
        if (frameRef.current) return;
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = null;
            setQuotes({ ...bufferRef.current });
        });
    }

    /* SOCKET INIT */
    useEffect(() => {
        if (!token) return;
        const socket = new MarketSocket();
        socketRef.current = socket;

        socket.connect(token, (raw: unknown) => {
            if (!isRecord(raw)) return;

            if (raw.status === "subscribed") {
                const s = raw.symbol;
                if (typeof s !== "string") return;
                if (!bufferRef.current[s]) return;

                const data = isRecord(raw.data) ? raw.data : undefined;

                const nextOpen = pickNumber(
                    raw.dayOpen,
                    raw.open,
                    data?.dayOpen,
                    data?.open
                );
                const nextClose = pickNumber(
                    raw.dayClose,
                    raw.close,
                    data?.dayClose,
                    data?.close,
                    raw.prevClose,
                    data?.prevClose
                );

                bufferRef.current[s] = {
                    ...bufferRef.current[s],
                    high:
                        pickNumber(raw.dayHigh, data?.dayHigh) ??
                        bufferRef.current[s].high,
                    low:
                        pickNumber(raw.dayLow, data?.dayLow) ??
                        bufferRef.current[s].low,
                    open: nextOpen ?? bufferRef.current[s].open,
                    close: nextClose ?? bufferRef.current[s].close,
                };
                flush();
                return;
            }

            if (raw.type === "orderbook") {
                const data = raw.data;
                if (!isRecord(data)) return;

                const s = data.code;
                if (typeof s !== "string") return;

                const bids = data.bids;
                const asks = data.asks;
                if (!Array.isArray(bids) || !Array.isArray(asks)) return;

                const bidRaw = bids[0];
                const askRaw = asks[0];
                if (!isRecord(bidRaw) || !isRecord(askRaw)) return;

                const bidPrice = bidRaw.price;
                const askPrice = askRaw.price;
                const bidVolume = bidRaw.volume;
                const askVolume = askRaw.volume;
                if (
                    typeof bidPrice !== "string" ||
                    typeof askPrice !== "string" ||
                    typeof bidVolume !== "string" ||
                    typeof askVolume !== "string"
                ) {
                    return;
                }

                const old = bufferRef.current[s];
                if (!old) return;

                const nextOpen = pickNumber(
                    data.dayOpen,
                    data.open,
                    data.openPrice
                );
                const nextClose = pickNumber(
                    data.dayClose,
                    data.close,
                    data.prevClose
                );

                bufferRef.current[s] = {
                    ...old,
                    bid: bidPrice,
                    ask: askPrice,
                    bidVolume,
                    askVolume,
                    high: pickNumber(data.dayHigh) ?? old.high,
                    low: pickNumber(data.dayLow) ?? old.low,
                    open: nextOpen ?? old.open,
                    close: nextClose ?? old.close,
                    bidDir:
                        old.bid === "--"
                            ? "same"
                            : Number(bidPrice) > Number(old.bid)
                                ? "up"
                                : Number(bidPrice) < Number(old.bid)
                                    ? "down"
                                    : old.bidDir,
                    askDir:
                        old.ask === "--"
                            ? "same"
                            : Number(askPrice) > Number(old.ask)
                                ? "up"
                                : Number(askPrice) < Number(old.ask)
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

    return quotes;
}
