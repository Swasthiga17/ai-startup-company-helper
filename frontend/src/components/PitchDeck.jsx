import React from 'react';

export default function PitchDeck({ deckUrl }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pitch Deck</h2>
      {deckUrl ? (
        <iframe
          src={deckUrl}
          title="Pitch Deck"
          className="w-full h-[80vh] border rounded-lg"
        />
      ) : (
        <p className="text-gray-600">Generate a pitch deck to view here.</p>
      )}
    </div>
  );
}
