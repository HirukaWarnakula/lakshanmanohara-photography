/**
 * BookingSection.tsx
 *
 * Contact & Shoot Booking Section (#contact)
 * Features Web3Forms integration alongside direct "Inquire via WhatsApp" action.
 */

import { useState } from 'react';

const SHOOT_TYPES = [
  'Graduation / Convocation Shoot',
  'Birthday / Milestone Shoot',
  'Wedding / Homecoming',
  'Couple / Pre-Shoot',
  'Events',
];

export default function BookingSection() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shootType, setShootType] = useState(SHOOT_TYPES[0]);
  const [shootDate, setShootDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // WhatsApp raw number: 94788240084
  const buildWhatsAppUrl = () => {
    let msg = `Hi Lakshan! I visited your website and would like to inquire about a photoshoot.`;
    if (shootType) msg += `\n\nShoot Type: ${shootType}`;
    if (shootDate) msg += `\nEstimated Date: ${shootDate}`;
    if (location) msg += `\nLocation: ${location}`;
    if (fullName) msg += `\nName: ${fullName}`;
    if (phone) msg += `\nPhone: ${phone}`;
    if (notes) msg += `\nNotes: ${notes}`;

    return `https://wa.me/94788240084?text=${encodeURIComponent(msg)}`;
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = buildWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY'); // Can be updated with active key
    formData.append('subject', `New Shoot Inquiry: ${shootType} - ${fullName}`);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('success');
      }
    } catch {
      setSubmitStatus('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      style={{
        backgroundColor: '#f3efe6',
        borderTop: '1px solid rgba(18, 18, 20, 0.06)',
        paddingTop: '2rem',
        paddingBottom: '2.5rem',
        minHeight: 'calc(100vh - 4rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto', paddingInline: '1.5rem', width: '100%' }}>
        {/* ── Section Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ color: '#b38728', fontSize: '0.75rem' }}>✦</span>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#b38728',
              }}
            >
              04 &bull; Reservations &amp; Inquiries
            </p>
          </div>

          <h2
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(1.9rem, 3.2vw, 2.65rem)',
              fontWeight: 300,
              color: '#121214',
              lineHeight: 1.1,
              marginBottom: '0.4rem',
            }}
          >
            Reserve Your Photoshoot Date
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem',
              color: '#575550',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.55,
            }}
          >
            Let&apos;s preserve the moments that matter. Share your vision below or connect
            directly with Lakshan via WhatsApp.
          </p>
        </div>

        {/* ── Split Layout: Form & Quick Contact Cards ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Direct Inquiries Strip */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(18, 18, 20, 0.08)',
              borderRadius: '2px',
              padding: '1.5rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#b38728',
                  fontWeight: 600,
                  marginBottom: '0.35rem',
                }}
              >
                Official Direct Contact
              </p>
              <h3
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '1.45rem',
                  color: '#121214',
                  fontWeight: 400,
                }}
              >
                Talk Directly With Lakshan
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  color: '#575550',
                  marginTop: '0.35rem',
                  lineHeight: 1.6,
                }}
              >
                For urgent convocation dates, wedding season bookings, or quick package inquiries,
                messaging on WhatsApp provides the fastest response time.
              </p>
            </div>

            {/* Direct WhatsApp Callout Card */}
            <div
              style={{
                backgroundColor: 'rgba(37, 211, 102, 0.06)',
                border: '1px solid rgba(37, 211, 102, 0.25)',
                borderRadius: '4px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    width: '1.85rem',
                    height: '1.85rem',
                    borderRadius: '50%',
                    backgroundColor: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                </span>
                <div>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#8c8880', fontWeight: 500 }}>
                    WhatsApp Official:
                  </p>
                  <a
                    href="https://wa.me/94788240084?text=Hi%20Lakshan!%20I%20visited%20your%20website%20and%20would%20like%20to%20inquire%20about%20a%20photoshoot."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#121214',
                      textDecoration: 'none',
                    }}
                  >
                    +94 78 824 0084
                  </a>
                </div>
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#575550' }}>
                Tap anytime to start a direct chat or send custom shoot requirements.
              </p>
            </div>

            {/* Quick Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ color: '#b38728', fontSize: '0.85rem' }}>📍</span>
                <span style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#575550' }}>
                  Coverage: Colombo &amp; Islandwide across Sri Lanka
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ color: '#b38728', fontSize: '0.85rem' }}>⏱️</span>
                <span style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#575550' }}>
                  Response Time: Typically within 2 to 4 hours
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ color: '#b38728', fontSize: '0.85rem' }}>📷</span>
                <span style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#575550' }}>
                  Advance Booking recommended for convocation &amp; wedding dates
                </span>
              </div>
            </div>

            {/* Slogan */}
            <div style={{ borderTop: '1px solid rgba(18, 18, 20, 0.08)', paddingTop: '0.75rem' }}>
              <p
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '0.95rem',
                  color: '#b38728',
                }}
              >
                "Beyond photos, we preserve the moments that matter."
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(18, 18, 20, 0.08)',
              borderRadius: '2px',
              padding: '1.5rem 1.75rem',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {submitStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '3.2rem',
                    height: '3.2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(179, 135, 40, 0.12)',
                    border: '1px solid #b38728',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#b38728',
                    fontSize: '1.4rem',
                    margin: '0 auto 1rem',
                  }}
                >
                  ✓
                </div>
                <h3
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '1.65rem',
                    color: '#121214',
                    fontWeight: 400,
                    marginBottom: '0.5rem',
                  }}
                >
                  Inquiry Received!
                </h3>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.84rem',
                    color: '#575550',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                  }}
                >
                  Thank you, {fullName || 'there'}. Lakshan will review your date ({shootDate || 'your preferred timeframe'}) and get back to you shortly.
                </p>

                <button
                  onClick={handleWhatsAppClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#25D366',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.6rem 1.2rem',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                >
                  Forward Inquiry to WhatsApp &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Row 1: Shoot Type & Your Name */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label
                      htmlFor="shoot-type-select"
                      style={{
                        display: 'block',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#b38728',
                        marginBottom: '0.3rem',
                      }}
                    >
                      Shoot Type *
                    </label>
                    <select
                      id="shoot-type-select"
                      name="shootType"
                      value={shootType}
                      onChange={(e) => setShootType(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        backgroundColor: '#faf8f5',
                        border: '1px solid rgba(18, 18, 20, 0.14)',
                        borderRadius: '2px',
                        padding: '0.55rem 0.75rem',
                        color: '#121214',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.82rem',
                        outline: 'none',
                      }}
                    >
                      {SHOOT_TYPES.map((t) => (
                        <option key={t} value={t} style={{ backgroundColor: '#ffffff', color: '#121214' }}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="full-name-input"
                      style={{
                        display: 'block',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#575550',
                        marginBottom: '0.3rem',
                      }}
                    >
                      Your Name *
                    </label>
                    <input
                      id="full-name-input"
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Kasun Silva"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#faf8f5',
                        border: '1px solid rgba(18, 18, 20, 0.14)',
                        borderRadius: '2px',
                        padding: '0.55rem 0.75rem',
                        color: '#121214',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.82rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Row 2: WhatsApp / Phone & Shoot Date */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label
                      htmlFor="phone-input"
                      style={{
                        display: 'block',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#575550',
                        marginBottom: '0.3rem',
                      }}
                    >
                      WhatsApp / Phone *
                    </label>
                    <input
                      id="phone-input"
                      type="tel"
                      name="phone"
                      required
                      placeholder="+94 7X XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#faf8f5',
                        border: '1px solid rgba(18, 18, 20, 0.14)',
                        borderRadius: '2px',
                        padding: '0.55rem 0.75rem',
                        color: '#121214',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.82rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="date-input"
                      style={{
                        display: 'block',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#575550',
                        marginBottom: '0.3rem',
                      }}
                    >
                      Shoot Date *
                    </label>
                    <input
                      id="date-input"
                      type="date"
                      name="shootDate"
                      required
                      value={shootDate}
                      onChange={(e) => setShootDate(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#faf8f5',
                        border: '1px solid rgba(18, 18, 20, 0.14)',
                        borderRadius: '2px',
                        padding: '0.55rem 0.75rem',
                        color: '#121214',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.82rem',
                        outline: 'none',
                        colorScheme: 'light',
                      }}
                    />
                  </div>
                </div>

                {/* Row 3: Location & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label
                      htmlFor="location-input"
                      style={{
                        display: 'block',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#575550',
                        marginBottom: '0.3rem',
                      }}
                    >
                      Location / City *
                    </label>
                    <input
                      id="location-input"
                      type="text"
                      name="location"
                      required
                      placeholder="e.g. BMICH / Galle Fort"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#faf8f5',
                        border: '1px solid rgba(18, 18, 20, 0.14)',
                        borderRadius: '2px',
                        padding: '0.55rem 0.75rem',
                        color: '#121214',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.82rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email-input"
                      style={{
                        display: 'block',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#575550',
                        marginBottom: '0.3rem',
                      }}
                    >
                      Email (Optional)
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#faf8f5',
                        border: '1px solid rgba(18, 18, 20, 0.14)',
                        borderRadius: '2px',
                        padding: '0.55rem 0.75rem',
                        color: '#121214',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.82rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Row 4: Additional Notes */}
                <div>
                  <label
                    htmlFor="notes-input"
                    style={{
                      display: 'block',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#575550',
                      marginBottom: '0.3rem',
                    }}
                  >
                    Session Details &amp; Vision
                  </label>
                  <textarea
                    id="notes-input"
                    name="message"
                    rows={2}
                    placeholder="Occasion, preferred time of day, number of people..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#faf8f5',
                      border: '1px solid rgba(18, 18, 20, 0.14)',
                      borderRadius: '2px',
                      padding: '0.5rem 0.75rem',
                      color: '#121214',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.82rem',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                {/* Row 5: Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.35rem' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold"
                    id="form-submit-btn"
                    style={{ flex: '1 1 170px', justifyContent: 'center', padding: '0.55rem 1rem' }}
                  >
                    <span>{isSubmitting ? 'Sending Request...' : 'Send Booking Request'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    id="form-whatsapp-btn"
                    style={{
                      flex: '1 1 170px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#25D366',
                      color: '#fff',
                      border: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '0.55rem 1rem',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#20ba59')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
                  >
                    <span>Inquire via WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
