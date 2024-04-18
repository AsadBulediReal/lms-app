import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
  height?: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};
const Banner = ({ label, variant, height }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];
  const isHeight = height ? height : "";
  return (
    <div className={`${cn(bannerVariants({ variant }))} ${isHeight}`}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
};

export default Banner;
