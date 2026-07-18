import { notFound } from 'next/navigation';
import { sectors, getSector } from '@/lib/sectors';
import { SectorPage } from './sector-page';

export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const sector = getSector(params.slug);
  if (!sector) return { title: 'Sector Not Found' };
  return {
    title: `${sector.title} — NovaYield`,
    description: sector.shortDesc,
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const sector = getSector(params.slug);
  if (!sector) notFound();
  return <SectorPage sector={sector} />;
}
