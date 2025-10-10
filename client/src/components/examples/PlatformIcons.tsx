import { PlatformIcons } from "../PlatformIcons";

export default function PlatformIconsExample() {
  return (
    <div className="space-y-2">
      <PlatformIcons platforms={["ps5", "xbox", "pc"]} />
      <PlatformIcons platforms={["switch", "pc"]} />
    </div>
  );
}
