// src/context/QuoteContext.js
import React, { createContext, useContext, useState } from 'react';

const QuoteContext = createContext();

export const useQuote = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
    const [quoteData, setQuoteData] = useState(null);

    return (
        <QuoteContext.Provider value={{ quoteData, setQuoteData }}>
            {children}
        </QuoteContext.Provider>
    );
};
