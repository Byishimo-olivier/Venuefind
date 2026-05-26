import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FormEvent } from 'react';
import type { Venue } from '../../data/venues';
import { sendVenueChat } from '../../services/ai';
import { extractIntent, recommendVenues } from './venueAi';

type Message = {
  role: 'assistant' | 'customer';
  text: string;
  recommendations?: Venue[];
};

export function AiRecommendations({ venues, title = 'AI Recommendations' }: { venues: Venue[]; title?: string }) {
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');
  const [budget, setBudget] = useState('');
  const [province, setProvince] = useState('');
  const intent = useMemo(() => ({
    budget: budget ? Number(budget) : undefined,
    category: eventType || undefined,
    guests: guests ? Number(guests) : undefined,
    province: province || undefined,
  }), [budget, eventType, guests, province]);
  const recommendations = useMemo(() => recommendVenues(venues, intent, 3), [intent, venues]);

  return (
    <section className="ai-recommendations">
      <div className="section-title-row">
        <div>
          <h2>{title}</h2>
          <p>Live venue matches based on your event details.</p>
        </div>
      </div>
      <div className="ai-recommendation-controls">
        <select value={eventType} onChange={(event) => setEventType(event.target.value)} aria-label="Event type">
          <option value="">Any event type</option>
          <option>Garden Venue</option>
          <option>Conference Hall</option>
          <option>Corporate Hub</option>
          <option>Indoor/Outdoor</option>
          <option>Heritage & Luxury Stay</option>
        </select>
        <input value={guests} onChange={(event) => setGuests(event.target.value)} inputMode="numeric" placeholder="Guests" />
        <input value={budget} onChange={(event) => setBudget(event.target.value)} inputMode="numeric" placeholder="Budget RWF" />
        <select value={province} onChange={(event) => setProvince(event.target.value)} aria-label="Province">
          <option value="">Any province</option>
          <option>Kigali City</option>
          <option>Eastern Province</option>
          <option>Northern Province</option>
          <option>Western Province</option>
          <option>Southern Province</option>
        </select>
      </div>
      <div className="ai-recommendation-list">
        {recommendations.map((venue) => (
          <Link to={`/venues/${venue.id}`} key={venue.id}>
            <img src={venue.heroImage} alt="" />
            <span>{venue.category}</span>
            <strong>{venue.name}</strong>
            <small>{venue.capacity} · {venue.price}</small>
          </Link>
        ))}
        {venues.length > 0 && recommendations.length === 0 && <p>No close matches yet.</p>}
      </div>
    </section>
  );
}

export function VenueAssistant({ venues }: { venues: Venue[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      recommendations: venues.slice(0, 2),
      role: 'assistant',
      text: 'Hi, I can shortlist venues by guests, budget, province, and event type.',
    },
  ]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const nextInput = input.trim();
    if (!nextInput || isThinking) return;
    const nextMessages: Message[] = [...messages, { role: 'customer', text: nextInput }];
    setMessages(nextMessages);
    setInput('');
    setIsThinking(true);

    try {
      const reply = await sendVenueChat(nextInput, messages.map((message) => ({
        role: message.role,
        text: message.text,
      })));
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: reply.reply, recommendations: reply.recommendations },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';
      const friendlyMessage = /route not found|404/i.test(errorMessage)
        ? 'The AI service is not running on the backend yet. Restart the backend so /api/ai/venue-chat is available, then ask me again.'
        : errorMessage || 'AI assistant is unavailable right now.';
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: friendlyMessage,
          recommendations: recommendVenues(venues, extractIntent(nextInput), 3),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  function usePrompt(prompt: string) {
    setInput(prompt);
  }

  const suggested = useMemo(() => recommendVenues(venues, extractIntent(input), 2), [input, venues]);

  return (
    <div className={`venue-assistant ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <section className="assistant-panel" aria-label="Venue assistant">
          <header>
            <div>
              <span className="assistant-mark" aria-hidden="true"><AssistantIcon /></span>
              <strong>Venue Assistant</strong>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant">Close</button>
          </header>
          <div className="assistant-prompts">
            <button type="button" onClick={() => usePrompt('Garden venue in Kigali for 200 guests')}>Garden in Kigali</button>
            <button type="button" onClick={() => usePrompt('Conference hall under 1000000 RWF')}>Conference budget</button>
          </div>
          <div className="assistant-messages">
            {messages.map((message, index) => (
              <article className={message.role} key={`${message.role}-${index}`}>
                <p>{message.text}</p>
                {message.recommendations && message.recommendations.length > 0 && (
                  <div>
                    {message.recommendations.map((venue) => (
                      <Link to={`/venues/${venue.id}`} key={venue.id}>
                        <strong>{venue.name}</strong>
                        <span>{venue.capacity} · {venue.price}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {isThinking && (
              <article className="assistant">
                <p>Thinking through your venue options...</p>
              </article>
            )}
          </div>
          {suggested.length > 0 && input.trim() && (
            <div className="assistant-live-hints">
              {suggested.map((venue) => <Link to={`/venues/${venue.id}`} key={venue.id}>{venue.name}</Link>)}
            </div>
          )}
          <form onSubmit={sendMessage}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask for venues by budget, guests, or location..." />
            <button type="submit" disabled={isThinking}>{isThinking ? 'Wait' : 'Send'}</button>
          </form>
        </section>
      )}
      <button className="assistant-toggle" type="button" onClick={() => setIsOpen((value) => !value)}>
        <AssistantIcon /> AI Assistant
      </button>
    </div>
  );
}

function AssistantIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.75l1.25 4.1a2.8 2.8 0 0 0 1.9 1.9L19.25 10l-4.1 1.25a2.8 2.8 0 0 0-1.9 1.9L12 17.25l-1.25-4.1a2.8 2.8 0 0 0-1.9-1.9L4.75 10l4.1-1.25a2.8 2.8 0 0 0 1.9-1.9L12 2.75z" />
      <path d="M18.5 14.5l.55 1.55a1.25 1.25 0 0 0 .75.75l1.55.55-1.55.55a1.25 1.25 0 0 0-.75.75l-.55 1.55-.55-1.55a1.25 1.25 0 0 0-.75-.75l-1.55-.55 1.55-.55a1.25 1.25 0 0 0 .75-.75l.55-1.55z" />
    </svg>
  );
}
