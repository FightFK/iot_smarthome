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
        borderRadius: "calc(var(--radius) + 4px)",
        border: "1px solid var(--border)",
        bgcolor: "var(--card)",
        boxShadow: "0 8px 20px color-mix(in oklch, black 35%, transparent)",
      }}
    >
      <CardContent sx={{ py: 2.5 }}>
        <Box className="flex items-start justify-between">
          <Box>
            <Typography variant="body2" sx={{ color: "var(--muted-foreground)" }}>
              {title}
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 28, fontWeight: 700, color: "var(--foreground)" }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: "var(--muted-foreground)" }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* ไอคอนในบับเบิล */}
          <Box
            className="grid place-items-center"
            sx={{
              width: 44,
              height: 44,
              borderRadius: "calc(var(--radius) - 2px)",
              background: "var(--accent)",
              border: "1px solid var(--border)",
            }}
          >
            {/* ใช้สีตาม foreground -> ขาวในดาร์ก, เข้มในไลท์ */}
            <IconComp sx={{ color: "var(--foreground)" }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
