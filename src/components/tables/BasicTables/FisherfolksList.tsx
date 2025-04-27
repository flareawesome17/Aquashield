import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface FisherFolk {
  id: number;
  image: string;
  name: string;
  role: string;
  latitude: number;
  longitude: number;
}

const fisherfolks: FisherFolk[] = [
  {
    id: 1,
    image: "/images/user/user-17.jpg",
    name: "Lindsey Curtis",
    role: "Fisherfolk",
    latitude: 8.611,
    longitude: 123.692,
  },
  {
    id: 2,
    image: "/images/user/user-18.jpg",
    name: "Kaiya George",
    role: "Fisherfolk",
    latitude: 8.604,
    longitude: 123.688,
  },
  {
    id: 3,
    image: "/images/user/user-19.jpg",
    name: "Zain Geidt",
    role: "Fisherfolk",
    latitude: 8.609,
    longitude: 123.695,
  },
];

export default function FisherfolksList({
  onSelect,
}: {
  onSelect: (fisher: FisherFolk) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Fisherfolk
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Latitude
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Longitude
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {fisherfolks.map((fisher) => (
              <TableRow
                key={fisher.id}
                onClick={() => onSelect(fisher)}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={fisher.image}
                        alt={fisher.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {fisher.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {fisher.role}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {fisher.latitude.toFixed(6)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {fisher.longitude.toFixed(6)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
