"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import SensorsIcon from "@mui/icons-material/Sensors";
import LightModeIcon from "@mui/icons-material/LightMode";

type IconKey = "thermostat" | "opacity" | "sensors" | "light";

const IconMap: Record<IconKey, React.ElementType> = {
  thermostat: ThermostatIcon,
  opacity: OpacityIcon,
  sensors: SensorsIcon,
  light: LightModeIcon,
};

export function OverviewCard({
  title,
  value,
  subtitle,
  icon = "thermostat",
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon?: IconKey;
}) {
  const IconComp = IconMap[icon];
  return (
    <Card elevation={0} sx={{ borderRadius: "14px", border: "1px solid #e5e7eb" }}>
      <CardContent>
        <Box className="flex items-start justify-between">
          <Box>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ mt: 1.2, fontWeight: 600 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ p: 1, bgcolor: "#f1f5f9", borderRadius: "8px", lineHeight: 0 }}>
            <IconComp fontSize="small" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
