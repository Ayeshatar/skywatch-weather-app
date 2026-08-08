import type { Metadata } from 'next';
import { Clock, Mail, MapPin } from 'lucide-react';
import Container from '@/components/common/Container';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the SkyWatch team — questions, suggestions, or feedback.',
};

const INFO_CARDS = [
  { icon: Mail, title: 'Email', value: 'support@skywatch.app' },
  { icon: MapPin, title: 'Location', value: 'Lahore, Pakistan' },
  { icon: Clock, title: 'Response Time', value: 'Within 24 hours' },
];

export default function ContactPage() {
  return (
    <Container className="py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
            Contact Us
          </span>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            We&apos;d love to hear from you!
          </h1>
          <p className="mt-4 max-w-md text-gray-600">
            Have questions, suggestions or feedback? Feel free to reach out to us.
          </p>

          <div className="mt-8 space-y-4">
            {INFO_CARDS.map((card) => (
              <div key={card.title} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-card">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <card.icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted">{card.title}</p>
                  <p className="text-sm font-semibold text-gray-800">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </Container>
  );
}
