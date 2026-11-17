import { HomePage, homeMetadata } from '@/components/landing-page/home-page';

export const generateMetadata = () => homeMetadata('nl');

export default function Page() {
  return <HomePage locale='nl' />;
}
