import { Cards, Card } from 'fumadocs-ui/components/card';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">Erik<a className="text-[#7c3bed]">Labs</a></h1>
      <p>
        This is a documentation of all the resources of the <b>3rd Year</b> of<br />
        <b>Dept. of <a className="text-[#7c3bed]">Computer Engineering & IoT</a></b>
      </p>
    </div>
  );
}
