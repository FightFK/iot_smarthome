"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

export function HistoryChart({
  selectedFilter,
  onFilterChange,
  hasEnoughRooms,
}: {
  selectedFilter: "today" | "week" | "month";
  onFilterChange: (v: "today" | "week" | "month") => void;
  hasEnoughRooms: boolean;
}) {
  return (
    <Card elevation={0} sx={{ borderRadius: "14px", border: "1px solid #e5e7eb" }}>
      <CardContent>
        <div className="mb-3 flex items-center justify-between">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Historical Temperature
          </Typography>
          <ToggleButtonGroup
            size="small"
            value={selectedFilter}
            exclusive
            onChange={(_, v) => v && onFilterChange(v)}
          >
            <ToggleButton value="today">today</ToggleButton>
            <ToggleButton value="week">week</ToggleButton>
            <ToggleButton value="month">month</ToggleButton>
          </ToggleButtonGroup>
        </div>

        {!hasEnoughRooms ? (
          <div className="text-center py-12 text-slate-500">
            Add at least 2 rooms to view historical data
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            {/* ตรงนี้เป็นพื้นที่กราฟ — หากต้องการใช้ MUI X Charts เพิ่มได้ภายหลัง */}
            (Chart placeholder — no library)
          </div>
        )}
      </CardContent>
    </Card>
  );
}
