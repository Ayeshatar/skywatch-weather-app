import Container from '@/components/common/Container';

export default function ContactPreview() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-8 shadow-card">
        <h2 className="mb-4 text-lg font-bold">Message sent!</h2>
        <p className="mb-6">Thanks for reaching out — we'll reply within 24 hours.</p>

        <hr className="my-6" />

        <h3 className="mb-2 text-sm font-semibold">Email template (HTML)</h3>
        <div className="prose max-w-none">
          <div style={{ padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
            <p>Hello <strong>{'{recipient_name}'}</strong>,</p>
            <p>Thanks for contacting SkyWatch. We received your message and will reply within 24 hours.</p>
            <p><strong>Your message:</strong></p>
            <blockquote style={{ background: '#f9f9f9', padding: 12, borderRadius: 6 }}>{'{message_body}'}</blockquote>
            <p>Best regards,<br/>SkyWatch Team</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
