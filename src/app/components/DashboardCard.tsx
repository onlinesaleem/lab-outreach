import Link from "next/link";

type DashboardCardProps = {
  title: string;
  value: number;
  href: string;
  color: string; // Color for text/background, passed dynamically
};

export default function DashboardCard({
  title,
  value,
  href,
  color,
}: DashboardCardProps) {
  return (
    <Link href={href}>
      <div
        className={`p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer ${color} text-white`}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </Link>
  );
}
