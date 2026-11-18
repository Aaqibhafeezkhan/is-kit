import { HomePage, homeMetadata } from '@/components/landing-page/home-page';

export const generateMetadata = () => homeMetadata('en');

export default function Page() {
  return <HomePage locale='en' />;
}
