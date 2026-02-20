"use client";

import {
    MarketSocket,
    isMarketSocketDebugEnabled,
} from "@/services/marketSocket.service";
import { QuoteLiveState } from "@/types/market";
import { useEffect, useRef, useState } from "react";

type QuoteMap = Record<string, QuoteLiveState>;

const SYMBOL_ALIAS_MAP: Record<string, string> = {
    SILVER: "XAGUSD",
    GOLD: "XAUUSD",
};

function normalizeSymbol(value: string) {
    return (value ?? "").trim().toUpperCase();
}

function resolveFeedSymbol(value: string) {
    const normalized = normalizeSymbol(value);
    if (!normalized) return "";
    return SYMBOL_ALIAS_MAP[normalized] ?? normalized;
}

export function useLiveQuotesBySymbols(
    token: string,
    symbols: string[]
) {
    const socketRef = useRef<MarketSocket | null>(null);
    const bufferRef = useRef<QuoteMap>({});
    const subscribedRef = useRef<Set<string>>(new Set());
    const frameRef = useRef<number | null>(null);
    const firstTickLoggedRef = useRef<Set<string>>(new Set());
    const firstMessageLoggedRef = useRef(false);
    const aliasesRef = useRef<Record<string, string[]>>({});

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

    function toQuoteString(value: unknown): string | undefined {
        if (typeof value === "string") return value;
        if (typeof value === "number" && Number.isFinite(value)) return value.toString();
        return undefined;
    }

    function createEmptyQuote(symbol: string): QuoteLiveState {
        return {
            symbol,
            bid: "--",
            ask: "--",
            bidVolume: "--",
            askVolume: "--",
            bidDir: "same",
            askDir: "same",
        };
    }

    function flush() {
        if (frameRef.current) return;
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = null;
            setQuotes({ ...bufferRef.current });
        });
    }

    useEffect(() => {
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, []);

    /* SOCKET INIT */
    useEffect(() => {
        const debug = isMarketSocketDebugEnabled();
        if (!token) {
            return;
        }
        const socket = new MarketSocket();
        socketRef.current = socket;

        const handleMessage = (raw: Record<string, unknown>) => {
            if (!firstMessageLoggedRef.current) {
                const meta = {
                    type: typeof raw.type === "string" ? raw.type : undefined,
                    status: typeof raw.status === "string" ? raw.status : undefined,
                    symbol: typeof raw.symbol === "string" ? raw.symbol : undefined,
                };
                if (debug) {
                    console.log("[LivePrice] message received", meta);
                }
                firstMessageLoggedRef.current = true;
            }

            if (raw.status === "subscribed") {
                const s = typeof raw.symbol === "string" ? normalizeSymbol(raw.symbol) : "";
                if (!s) return;
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
                const aliases = aliasesRef.current[s] ?? [];
                aliases.forEach((alias) => {
                    if (alias === s) return;
                    bufferRef.current[alias] = { ...bufferRef.current[s], symbol: alias };
                });
                flush();
                return;
            }

            if (raw.type === "orderbook") {
                const data = raw.data;
                if (!isRecord(data)) return;

                const s = typeof data.code === "string" ? normalizeSymbol(data.code) : "";
                if (!s) return;

                const bids = data.bids;
                const asks = data.asks;
                if (!Array.isArray(bids) || !Array.isArray(asks)) return;

                const bidRaw = bids[0];
                const askRaw = asks[0];
                if (!isRecord(bidRaw) || !isRecord(askRaw)) return;

                const bidPrice = toQuoteString(bidRaw.price);
                const askPrice = toQuoteString(askRaw.price);
                const bidVolume = toQuoteString(bidRaw.volume);
                const askVolume = toQuoteString(askRaw.volume);
                if (!bidPrice || !askPrice || !bidVolume || !askVolume) {
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

                const aliases = aliasesRef.current[s] ?? [];
                aliases.forEach((alias) => {
                    if (alias === s) return;
                    bufferRef.current[alias] = { ...bufferRef.current[s], symbol: alias };
                });

                if (!firstTickLoggedRef.current.has(s)) {
                    if (debug) {
                        console.log("[LivePrice] first tick", {
                            symbol: s,
                            bid: bidPrice,
                            ask: askPrice,
                        });
                    }
                    firstTickLoggedRef.current.add(s);
                }
                flush();
            }
        };

        socket.connect(token, (raw: unknown) => {
            if (Array.isArray(raw)) {
                raw.forEach((item) => {
                    if (isRecord(item)) handleMessage(item);
                });
                return;
            }

            if (!isRecord(raw)) return;
            handleMessage(raw);
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
        const debug = isMarketSocketDebugEnabled();
        const normalizedSymbols = symbols
            .map((s) => normalizeSymbol(s))
            .filter(Boolean);
        const feedSymbols = normalizedSymbols.map((s) => resolveFeedSymbol(s));
        const nextFeed = new Set(feedSymbols);
        const nextAliases = new Set(normalizedSymbols);
        const aliasesByFeed: Record<string, string[]> = {};

        normalizedSymbols.forEach((displaySymbol, idx) => {
            const feedSymbol = feedSymbols[idx];
            if (!feedSymbol) return;
            if (!aliasesByFeed[feedSymbol]) aliasesByFeed[feedSymbol] = [];
            if (!aliasesByFeed[feedSymbol].includes(displaySymbol)) {
                aliasesByFeed[feedSymbol].push(displaySymbol);
            }
        });

        aliasesRef.current = aliasesByFeed;

        nextFeed.forEach((feedSymbol) => {
            if (!subscribedRef.current.has(feedSymbol)) {
                subscribedRef.current.add(feedSymbol);
                if (!bufferRef.current[feedSymbol]) {
                    bufferRef.current[feedSymbol] = createEmptyQuote(feedSymbol);
                }
                if (debug) {
                    console.log("[LivePrice] subscribe", { symbol: feedSymbol });
                }
                socketRef.current?.subscribe(feedSymbol);
            }

            const aliases = aliasesByFeed[feedSymbol] ?? [];
            aliases.forEach((alias) => {
                if (!bufferRef.current[alias]) {
                    bufferRef.current[alias] = {
                        ...bufferRef.current[feedSymbol],
                        symbol: alias,
                    };
                }
            });
        });

        subscribedRef.current.forEach((feedSymbol) => {
            if (!nextFeed.has(feedSymbol)) {
                subscribedRef.current.delete(feedSymbol);
                socketRef.current?.unsubscribe(feedSymbol);
                if (debug) {
                    console.log("[LivePrice] unsubscribe", { symbol: feedSymbol });
                }
            }
        });

        const keepKeys = new Set<string>([...nextFeed, ...nextAliases]);
        Object.keys(bufferRef.current).forEach((key) => {
            if (!keepKeys.has(key)) {
                delete bufferRef.current[key];
            }
        });

        flush();
    }, [symbols]);

    return quotes;
}
