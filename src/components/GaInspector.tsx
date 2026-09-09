import React, { useState, useEffect } from 'react';
import { Activity, X, Trash2, ChevronRight, Copy, Check, Terminal } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getGAEventHistory, clearGAEventHistory, subscribeToGAEvents, GA_MEASUREMENT_ID } from '../utils/analytics';
import { GAEventLog } from '../types';

export const GaInspector: React.FC = () => {
  const { isGaInspectorOpen, setIsGaInspectorOpen } = useShop();
  const [events, setEvents] = useState<GAEventLog[]>(() => getGAEventHistory());
  const [selectedEvent, setSelectedEvent] = useState<GAEventLog | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Subscribe to new events in real time
    const unsubscribe = subscribeToGAEvents(newEvent => {
      setEvents(prev => [newEvent, ...prev].slice(0, 50));
    });
    return unsubscribe;
  }, []);

  if (!isGaInspectorOpen) return null;

  const handleClear = () => {
    clearGAEventHistory();
    setEvents([]);
    setSelectedEvent(null);
  };

  const copyPayload = () => {
    if (!selectedEvent) return;
    navigator.clipboard.writeText(JSON.stringify(selectedEvent, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-gray-900 text-gray-100 h-full shadow-2xl flex flex-col border-l border-gray-800">
        {/* Top Header */}
        <div className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-sm font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#4285F4]" />
              GA4 Realtime Telemetry Inspector
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              title="Clear event logs"
              className="p-1.5 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsGaInspectorOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration status strip */}
        <div className="px-4 py-2.5 bg-gray-900/90 border-b border-gray-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <span>Config:</span>
            <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-300 font-mono">
              VITE_GA_MEASUREMENT_ID
            </code>
          </div>
          <div>
            {GA_MEASUREMENT_ID ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                Active: {GA_MEASUREMENT_ID}
              </span>
            ) : (
              <span className="text-amber-400 font-medium">
                Simulated Sandbox (Ready for ID)
              </span>
            )}
          </div>
        </div>

        {/* Academic Project Viva Note */}
        <div className="px-4 py-2 bg-blue-950/40 border-b border-blue-900/50 text-[11px] text-blue-200">
          💡 <strong>KES Shroff College Evaluation:</strong> Every interaction (viewing catalog, filtering, selecting items, cart actions, checkout, purchase) fires standard GA4 Enhanced Ecommerce events.
        </div>

        {/* Main Content Area: Left Event List, Right / Bottom JSON Inspector */}
        <div className="flex-1 overflow-hidden grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-800">
          {/* Events Stream List */}
          <div className="overflow-y-auto p-3 space-y-1.5">
            <div className="text-[11px] uppercase font-bold text-gray-500 tracking-wider mb-2 px-1">
              Captured Events ({events.length})
            </div>

            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                No events captured yet. Navigate the store or add items to trigger telemetry!
              </div>
            ) : (
              events.map(ev => {
                const isSelected = selectedEvent?.id === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/30 border border-blue-500 text-white'
                        : 'bg-gray-850 hover:bg-gray-800 border border-gray-800/80 text-gray-300'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-semibold text-blue-400 truncate">
                        {ev.eventName}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {ev.timestamp}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  </button>
                );
              })
            )}
          </div>

          {/* Event Payload Viewer */}
          <div className="overflow-y-auto p-3 flex flex-col bg-gray-950">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-800">
              <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                Event Payload JSON
              </span>
              {selectedEvent && (
                <button
                  onClick={copyPayload}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white px-2 py-0.5 rounded bg-gray-800"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {selectedEvent ? (
              <pre className="flex-1 text-[11px] font-mono text-emerald-300 overflow-x-auto p-2 bg-gray-900 rounded-lg whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    event: selectedEvent.eventName,
                    timestamp: selectedEvent.timestamp,
                    ecommerce: selectedEvent.params,
                  },
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-6 text-gray-600 text-xs">
                Select an event from the stream to inspect GA4 parameter payloads.
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-gray-950 border-t border-gray-800 text-[11px] text-gray-500 flex items-center justify-between">
          <span>GA4 Ecommerce Telemetry Engine</span>
          <button
            onClick={() => setIsGaInspectorOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
