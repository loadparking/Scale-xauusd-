import { GoogleGenAI, Type } from "@google/genai";
import { PriceData, TradingSignal, NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeMarket(
  symbol: string,
  priceHistory: PriceData[],
  recentNews: NewsItem[],
  timeframe: string = '1H'
): Promise<TradingSignal> {
  const prompt = `
    Analyze the following market data for ${symbol} on a ${timeframe} timeframe:
    
    Price History (last 24 intervals):
    ${JSON.stringify(priceHistory.slice(-24))}
    
    Recent News:
    ${JSON.stringify(recentNews)}
    
    Provide a trading signal (BUY, SELL, or HOLD) with confidence (0-100), detailed reasoning, and technical indicators.
    Include:
    1. Entry Price (current or recommended)
    2. Target Price (Take Profit)
    3. Stop Loss Price
    4. RSI
    5. MACD (value, signal, histogram)
    6. Bollinger Bands (upper, middle, lower)
    7. Support and Resistance levels
    8. Moving Average trend
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD"] },
          confidence: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          entry: { type: Type.NUMBER },
          target: { type: Type.NUMBER },
          stopLoss: { type: Type.NUMBER },
          indicators: {
            type: Type.OBJECT,
            properties: {
              rsi: { type: Type.NUMBER },
              macd: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.NUMBER },
                  signal: { type: Type.NUMBER },
                  histogram: { type: Type.NUMBER },
                },
                required: ["value", "signal", "histogram"],
              },
              bollingerBands: {
                type: Type.OBJECT,
                properties: {
                  upper: { type: Type.NUMBER },
                  middle: { type: Type.NUMBER },
                  lower: { type: Type.NUMBER },
                },
                required: ["upper", "middle", "lower"],
              },
              supportLevels: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER },
              },
              resistanceLevels: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER },
              },
              movingAverage: { type: Type.STRING },
            },
            required: ["rsi", "macd", "movingAverage"],
          },
        },
        required: ["type", "confidence", "reasoning", "indicators"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  return {
    ...result,
    timestamp: new Date().toISOString(),
  };
}

export async function analyzeChartImage(
  base64Image: string,
  mimeType: string
): Promise<TradingSignal> {
  const prompt = `
    Analyze this XAU/USD (Gold) trading chart. 
    Look for:
    1. Support and Resistance levels.
    2. Trend lines and patterns (e.g., Head and Shoulders, Double Top/Bottom).
    3. Candlestick patterns.
    4. Indicators visible on the chart (RSI, MACD, Moving Averages, Bollinger Bands).
    
    Provide a trading signal (BUY, SELL, or HOLD) with confidence (0-100), detailed reasoning based on the image, and technical indicators values if visible or estimated.
    Include:
    1. Entry Price (current or recommended)
    2. Target Price (Take Profit)
    3. Stop Loss Price
    4. RSI
    5. MACD (value, signal, histogram)
    6. Bollinger Bands (upper, middle, lower)
    7. Support and Resistance levels
    8. Moving Average trend
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { data: base64Image, mimeType } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD"] },
          confidence: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          entry: { type: Type.NUMBER },
          target: { type: Type.NUMBER },
          stopLoss: { type: Type.NUMBER },
          indicators: {
            type: Type.OBJECT,
            properties: {
              rsi: { type: Type.NUMBER },
              macd: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.NUMBER },
                  signal: { type: Type.NUMBER },
                  histogram: { type: Type.NUMBER },
                },
                required: ["value", "signal", "histogram"],
              },
              bollingerBands: {
                type: Type.OBJECT,
                properties: {
                  upper: { type: Type.NUMBER },
                  middle: { type: Type.NUMBER },
                  lower: { type: Type.NUMBER },
                },
                required: ["upper", "middle", "lower"],
              },
              supportLevels: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER },
              },
              resistanceLevels: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER },
              },
              movingAverage: { type: Type.STRING },
            },
            required: ["rsi", "macd", "movingAverage"],
          },
        },
        required: ["type", "confidence", "reasoning", "indicators"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  return {
    ...result,
    timestamp: new Date().toISOString(),
  };
}
