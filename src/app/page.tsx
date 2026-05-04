import { PRIVATE_PATHS_NAME } from '@/constants/paths-name';
import { redirect } from 'next/navigation';

export default function Home() {
  return redirect(PRIVATE_PATHS_NAME.CALENDAR);
}
