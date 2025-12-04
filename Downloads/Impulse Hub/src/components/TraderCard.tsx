import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TraderCardProps {
  trader: {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
    performance: string;
    verified: boolean;
  };
}

export function TraderCard({ trader }: TraderCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow duration-300">
        <ImageWithFallback
          src={trader.avatar}
          alt={trader.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg text-black group-hover:text-gray-600 transition-colors">{trader.name}</h3>
        <p className="text-gray-500">{trader.specialty}</p>
        <p className="text-black font-medium">{trader.performance}</p>
      </div>
    </div>
  );
}