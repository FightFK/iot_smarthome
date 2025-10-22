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
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        bgcolor: "rgba(255,255,255,.9)",
        boxShadow: "0 2px 12px rgba(15,23,42,.04)",
      }}
    >
      <CardContent sx={{ py: 2.5 }}>
        <Box className="flex items-start justify-between">
          <Box>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              {title}
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 28, fontWeight: 700, color: "#0f172a" }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* soft icon bubble */}
          <Box
            className="grid place-items-center"
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #eff6ff, #ecfeff)",
              border: "1px solid #e5e7eb",
            }}
          >
            <IconComp sx={{ color: "#2563eb" }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
