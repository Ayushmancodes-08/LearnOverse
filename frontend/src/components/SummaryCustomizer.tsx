import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SummaryStyle, SummaryDepth, SummaryLength } from "@/lib/summary-types";

interface SummaryCustomizerProps {
  style: SummaryStyle;
  depth: SummaryDepth;
  length: SummaryLength;
  onStyleChange: (style: SummaryStyle) => void;
  onDepthChange: (depth: SummaryDepth) => void;
  onLengthChange: (length: SummaryLength) => void;
}

export const SummaryCustomizer = ({
  style,
  depth,
  length,
  onStyleChange,
  onDepthChange,
  onLengthChange,
}: SummaryCustomizerProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg border border-border">
      {/* Style Selector */}
      <div className="space-y-2">
        <Label htmlFor="summary-style" className="text-sm font-medium text-foreground">
          Style
        </Label>
        <Select value={style} onValueChange={(value) => onStyleChange(value as SummaryStyle)}>
          <SelectTrigger id="summary-style" className="w-full">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conceptual">Conceptual</SelectItem>
            <SelectItem value="mathematical">Mathematical</SelectItem>
            <SelectItem value="bullet-points">Bullet Points</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Depth Selector */}
      <div className="space-y-2">
        <Label htmlFor="summary-depth" className="text-sm font-medium text-foreground">
          Depth
        </Label>
        <Select value={depth} onValueChange={(value) => onDepthChange(value as SummaryDepth)}>
          <SelectTrigger id="summary-depth" className="w-full">
            <SelectValue placeholder="Select depth" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Length Selector */}
      <div className="space-y-2">
        <Label htmlFor="summary-length" className="text-sm font-medium text-foreground">
          Length
        </Label>
        <Select value={length} onValueChange={(value) => onLengthChange(value as SummaryLength)}>
          <SelectTrigger id="summary-length" className="w-full">
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="long">Long</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
