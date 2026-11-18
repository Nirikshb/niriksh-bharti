import ActivityRiff from '@/components/ActivityRiff';
import RiffA from '@/components/RiffA';

export default function Home() {
  return (
    <main className="flex w-full flex-col">
      <RiffA />
      <ActivityRiff />
    </main>
  );
}
