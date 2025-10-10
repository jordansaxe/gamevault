import { Gamepad2, Monitor, Apple } from "lucide-react";
import { SiPlaystation, SiNintendoswitch } from "react-icons/si";

interface PlatformIconsProps {
  platforms: string[];
}

const platformIcons: Record<string, React.ReactNode> = {
  ps5: <SiPlaystation className="h-3.5 w-3.5" />,
  ps4: <SiPlaystation className="h-3.5 w-3.5" />,
  xbox: <Gamepad2 className="h-3.5 w-3.5" />,
  switch: <SiNintendoswitch className="h-3.5 w-3.5" />,
  pc: <Monitor className="h-3.5 w-3.5" />,
  mac: <Apple className="h-3.5 w-3.5" />,
  default: <Gamepad2 className="h-3.5 w-3.5" />,
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
