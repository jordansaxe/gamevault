import { Monitor, Apple, Gamepad2 } from "lucide-react";
import { SiPlaystation, SiNintendoswitch, SiSteam } from "react-icons/si";
import { FaXbox } from "react-icons/fa";

interface PlatformIconsProps {
  platforms: string[];
}

const platformIcons: Record<string, React.ReactNode> = {
  playstation: <SiPlaystation className="h-4 w-4" />,
  ps5: <SiPlaystation className="h-4 w-4" />,
  ps4: <SiPlaystation className="h-4 w-4" />,
  ps3: <SiPlaystation className="h-4 w-4" />,
  "playstation 5": <SiPlaystation className="h-4 w-4" />,
  "playstation 4": <SiPlaystation className="h-4 w-4" />,
  "playstation 3": <SiPlaystation className="h-4 w-4" />,
  xbox: <FaXbox className="h-4 w-4" />,
  "xbox one": <FaXbox className="h-4 w-4" />,
  "xbox series x|s": <FaXbox className="h-4 w-4" />,
  "xbox series": <FaXbox className="h-4 w-4" />,
  "xbox 360": <FaXbox className="h-4 w-4" />,
  switch: <SiNintendoswitch className="h-4 w-4" />,
  "nintendo switch": <SiNintendoswitch className="h-4 w-4" />,
  pc: <SiSteam className="h-4 w-4" />,
  "pc (microsoft windows)": <SiSteam className="h-4 w-4" />,
  windows: <SiSteam className="h-4 w-4" />,
  steam: <SiSteam className="h-4 w-4" />,
  mac: <Apple className="h-4 w-4" />,
  macos: <Apple className="h-4 w-4" />,
  linux: <Monitor className="h-4 w-4" />,
  default: <Gamepad2 className="h-4 w-4" />,
};

export function PlatformIcons({ platforms }: PlatformIconsProps) {
  return (
    <div className="flex items-center gap-1.5" data-testid="platform-icons">
      {platforms.slice(0, 4).map((platform, i) => (
        <div 
          key={i} 
          className="text-muted-foreground"
          data-testid={`icon-platform-${platform}`}
        >
          {platformIcons[platform.toLowerCase()] || platformIcons.default}
        </div>
      ))}
    </div>
  );
}
