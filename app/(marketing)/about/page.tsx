import type { Metadata } from 'next';
import Container from '@/components/common/Container';

export const metadata: Metadata = {
  title: 'About',
  description: "Learn about SkyWatch's mission to deliver accurate, real-time weather information.",
};

const VALUES = [
  { title: 'Our Mission', description: 'Provide accurate weather data with a delightful experience.' },
  { title: 'Our Vision', description: 'Be the most trusted weather platform for everyone, everywhere.' },
  { title: 'Our Values', description: 'Accuracy, simplicity, reliability and user satisfaction.' },
];

export default function AboutPage() {
  return (
    <Container className="py-14">
      <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
        About Us
      </span>
      <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            We&apos;re passionate about <span className="text-primary">weather</span> and technology
          </h1>
          <p className="mt-4 text-gray-600">
            SkyWatch was built to deliver accurate, real-time weather information in a simple and beautiful way. Our mission is to help people make better decisions every day.
            We combine easy-to-read forecasts, timely alerts, and a clean mobile-first experience so every plan is backed by reliable weather insights.
          </p>
        </div>
        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-blue-100">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXKTZQjd756JQAuP2E5116P0cDzu8j9XDiigfcBHA7GQ&s"
            alt="Professional weather team"
            className="h-full w-full object-cover"
            width={1400}
            height={1050}
          />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {VALUES.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
